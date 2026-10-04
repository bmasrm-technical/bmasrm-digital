"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Resend } from "resend";
import { consultationSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { createServiceClient } from "@/lib/supabase/service";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitConsultation(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    service: formData.get("service"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    plan: formData.get("plan"),
    video_duration_minutes: formData.get("video_duration_minutes"),
    project_details: formData.get("project_details"),
    visitor_id: formData.get("visitor_id"),
    honeypot: formData.get("honeypot"),
  };

  // 1. Zod Validation
  const parseResult = consultationSchema.safeParse(rawData);
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const fieldName = issue.path[0] as string;
      if (fieldName && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    }
    return {
      error: parseResult.error.issues[0]?.message || "Validation failed. Please check your inputs.",
      fieldErrors,
    };
  }

  const data = parseResult.data;

  // 2. Honeypot check: pretend success if bot filled honeypot
  if (data.honeypot && data.honeypot.trim().length > 0) {
    redirect("/thank-you");
  }

  // 3. Rate limiting (max 5 submissions per 10 minutes)
  const reqHeaders = await headers();
  const clientIp = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateCheck = checkRateLimit(`consultation:${clientIp}`, 5, 10 * 60 * 1000);

  if (!rateCheck.success) {
    return {
      error: "Too many consultation requests from this device. Please try again in a few minutes.",
    };
  }

  // 4. Supabase DB Insertion via Service Role
  let shouldRedirect = false;

  try {
    const supabase = createServiceClient();

    // 4a. Upsert customer on conflict (phone)
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          name: data.name,
          phone: data.phone,
          ...(data.email ? { email: data.email } : {}),
        },
        { onConflict: "phone" }
      )
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("Customer upsert error:", customerError?.message);
      return { error: "Submission failed. Please check your inputs and try again." };
    }

    // 4b. Compute pages_viewed from page_views (last 24h, max 10 distinct paths)
    let pagesViewedStr: string | null = null;
    if (data.visitor_id) {
      const { data: views } = await supabase
        .from("page_views")
        .select("path, created_at")
        .eq("visitor_id", data.visitor_id)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true })
        .limit(20);

      if (views && views.length > 0) {
        const distinctPaths = Array.from(new Set(views.map((v) => v.path))).slice(0, 10);
        pagesViewedStr = distinctPaths.join(", ");
      }
    }

    const referer = reqHeaders.get("referer") || "";
    const sourcePage = referer ? new URL(referer).pathname : "/contact";

    // 4c. Insert into website_bookings or editing_bookings
    if (data.service === "website") {
      const { error: bookingError } = await supabase.from("website_bookings").insert({
        customer_id: customer.id,
        plan: data.plan || "not_sure",
        project_details: data.project_details || null,
        status: "new",
        source_page: sourcePage,
        pages_viewed: pagesViewedStr,
      });

      if (bookingError) {
        console.error("Website booking error:", bookingError.message);
        return { error: "Unable to process booking. Please try again." };
      }
    } else {
      const { error: bookingError } = await supabase.from("editing_bookings").insert({
        customer_id: customer.id,
        video_duration_minutes: data.video_duration_minutes || 5,
        project_details: data.project_details || null,
        status: "new",
        source_page: sourcePage,
        pages_viewed: pagesViewedStr,
      });

      if (bookingError) {
        console.error("Editing booking error:", bookingError.message);
        return { error: "Unable to process booking. Please try again." };
      }
    }

    // 5. Optional Email Notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (resendApiKey && notifyEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "BMASRM.digital <noreply@bmasrm.digital>",
          to: notifyEmail,
          subject: `New ${data.service === "website" ? "Website" : "Video"} Consultation Request`,
          text: `New request from ${data.name} (${data.phone})\nService: ${data.service}\nDetails: ${data.project_details || "N/A"}`,
        });
      } catch (emailErr) {
        console.error("Resend notification error:", emailErr);
      }
    }

    shouldRedirect = true;
  } catch (err) {
    console.error("Consultation submission exception:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }

  if (shouldRedirect) {
    redirect("/thank-you");
  }

  return {};
}
