import { z } from "zod";

/**
 * Section 7.2 Phone normalization & validation
 * - Strip spaces, dashes, brackets.
 * - A 10-digit number starting with 6-9 is treated as Indian and stored as +91XXXXXXXXXX.
 * - A number starting with +91 or 91 (12 digits) is stored as +91XXXXXXXXXX.
 * - Other numbers must start with + and have 8-15 digits; store as given (digits after +).
 * - Anything else -> validation error: Please enter a valid phone number.
 */
export function normalizePhone(rawPhone: string): { success: boolean; phone?: string; error?: string } {
  if (!rawPhone || typeof rawPhone !== "string") {
    return { success: false, error: "Please enter a valid phone number." };
  }

  // Strip spaces, dashes, parentheses
  const cleaned = rawPhone.replace(/[\s\-\(\)]/g, "").trim();

  // 10-digit Indian number starting with 6-9
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return { success: true, phone: `+91${cleaned}` };
  }

  // 12-digit Indian number starting with 91 followed by 6-9
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return { success: true, phone: `+${cleaned}` };
  }

  // +91 followed by 10 digits starting with 6-9
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return { success: true, phone: cleaned };
  }

  // International format: starts with + followed by 8-15 digits
  if (/^\+\d{8,15}$/.test(cleaned)) {
    return { success: true, phone: cleaned };
  }

  return { success: false, error: "Please enter a valid phone number." };
}

export const phoneSchema = z.string().transform((val, ctx) => {
  const result = normalizePhone(val);
  if (!result.success || !result.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error || "Please enter a valid phone number.",
    });
    return z.NEVER;
  }
  return result.phone;
});

export const consultationSchema = z.object({
  service: z.enum(["website", "video"]),
  name: z.string().trim().min(2, "Name must be 2-80 characters").max(80, "Name must be 2-80 characters"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(120, "Email cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  plan: z.enum(["signature_build", "managed_website", "not_sure"]).optional().default("not_sure"),
  video_duration_minutes: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ message: "Please enter video duration in minutes" }).int()
    )
    .optional(),
  project_details: z
    .string()
    .trim()
    .max(1000, "Project details cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  visitor_id: z.string().optional().or(z.literal("")),
  honeypot: z.string().optional().or(z.literal("")),
}).refine(
  (data) => {
    if (data.service === "video") {
      return (
        typeof data.video_duration_minutes === "number" &&
        !isNaN(data.video_duration_minutes) &&
        data.video_duration_minutes >= 5
      );
    }
    return true;
  },
  {
    message: "We only take videos of 5 minutes or longer",
    path: ["video_duration_minutes"],
  }
);

export type ConsultationInput = z.infer<typeof consultationSchema>;

// URL validation helper (http/https only)
export const httpUrlSchema = z
  .string()
  .trim()
  .refine(
    (url) => !url || /^https?:\/\/.+/i.test(url),
    "URL must start with http:// or https://"
  )
  .optional()
  .or(z.literal(""));

export const workSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  category: z.enum(["website", "video"]),
  client_name: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().optional().or(z.literal("")),
  challenge: z.string().trim().optional().or(z.literal("")),
  solution: z.string().trim().optional().or(z.literal("")),
  result: z.string().trim().optional().or(z.literal("")),
  thumbnail_url: httpUrlSchema,
  video_url: httpUrlSchema,
  live_url: httpUrlSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export type WorkInput = z.infer<typeof workSchema>;
