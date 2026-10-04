import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { createServiceClient } from "@/lib/supabase/service";

const trackPayloadSchema = z.object({
  visitorId: z.string().uuid("Invalid visitor UUID"),
  path: z
    .string()
    .min(1)
    .max(200)
    .startsWith("/", "Path must start with /")
    .refine((p) => !p.startsWith("/admin") && !p.startsWith("/api"), {
      message: "Admin and API paths are excluded from analytics",
    }),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (120 requests per minute)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(`track:${clientIp}`, 120, 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 2. Parse payload
    const body = await req.json();
    const parseResult = trackPayloadSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { visitorId, path } = parseResult.data;

    // 3. Upsert visitor & insert page_view using Service Role
    const supabase = createServiceClient();
    const nowIso = new Date().toISOString();

    // Upsert visitor
    await supabase.from("visitors").upsert(
      {
        id: visitorId,
        last_seen: nowIso,
      },
      { onConflict: "id" }
    );

    // Insert page view
    await supabase.from("page_views").insert({
      visitor_id: visitorId,
      path: path,
    });

    return NextResponse.json({ success: true });
  } catch {
    // Silent response to prevent leaking internal stack traces or database info
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
