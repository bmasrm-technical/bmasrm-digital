"use client";

import React, { useState, useActionState } from "react";
import { submitConsultation, FormState } from "@/app/contact/actions";
import { siteConfig } from "@/config/site";

interface ConsultationFormProps {
  initialService?: "website" | "video";
  initialPlan?: "signature_build" | "managed_website" | "not_sure";
}

export function ConsultationForm({
  initialService = "website",
  initialPlan = "not_sure",
}: ConsultationFormProps) {
  const [service, setService] = useState<"website" | "video">(initialService);
  const [plan, setPlan] = useState<string>(initialPlan);
  const [visitorId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bmasrm_vid") || "";
    }
    return "";
  });

  const initialState: FormState = {};
  const [state, formAction, isPending] = useActionState(submitConsultation, initialState);

  return (
    <form action={formAction} className="bg-[#11100D] border border-[#D2B277]/20 p-6 sm:p-10 rounded-2xl space-y-6 shadow-2xl max-w-2xl mx-auto">
      {state?.error && (
        <div className="p-4 rounded bg-red-950/60 border border-red-800/80 text-red-200 text-sm font-medium">
          {state.error}
        </div>
      )}

      {/* Hidden Fields */}
      <input type="hidden" name="visitor_id" value={visitorId} />
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Service Selector */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Select Service <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setService("website")}
            className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
              service === "website"
                ? "bg-[#D2B277] text-[#0A0908] border-[#D2B277]"
                : "bg-[#0A0908] text-[#A69D8C] border-[#D2B277]/20 hover:border-[#D2B277]/50"
            }`}
          >
            Website Building
          </button>
          <button
            type="button"
            onClick={() => setService("video")}
            className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
              service === "video"
                ? "bg-[#D2B277] text-[#0A0908] border-[#D2B277]"
                : "bg-[#0A0908] text-[#A69D8C] border-[#D2B277]/20 hover:border-[#D2B277]/50"
            }`}
          >
            Video Editing
          </button>
        </div>
        <input type="hidden" name="service" value={service} />
      </div>

      {/* Name Field */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          placeholder="John Doe"
          className="w-full h-12 px-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] placeholder-[#A69D8C]/50 focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors"
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-red-400 font-medium">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
          Phone Number <span className="text-red-400">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          className="w-full h-12 px-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] placeholder-[#A69D8C]/50 focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors"
        />
        {state?.fieldErrors?.phone && (
          <p className="text-xs text-red-400 font-medium">{state.fieldErrors.phone}</p>
        )}
      </div>

      {/* Email Field (Optional) */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
          Email Address <span className="text-[#A69D8C]/60 text-[10px] font-normal">(Optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={120}
          placeholder="john@example.com"
          className="w-full h-12 px-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] placeholder-[#A69D8C]/50 focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors"
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-400 font-medium">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* Conditional: Website Plan */}
      {service === "website" && (
        <div className="space-y-1.5">
          <label htmlFor="plan" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
            Preferred Plan <span className="text-[#A69D8C]/60 text-[10px] font-normal">(Optional)</span>
          </label>
          <select
            id="plan"
            name="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full h-12 px-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors"
          >
            <option value="not_sure">Not Sure / Need Advice</option>
            <option value="signature_build">Signature Build (One-Time)</option>
            <option value="managed_website">Managed Website (Monthly)</option>
          </select>
        </div>
      )}

      {/* Conditional: Video Duration */}
      {service === "video" && (
        <div className="space-y-1.5">
          <label htmlFor="video_duration_minutes" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
            Estimated Video Duration (Minutes) <span className="text-red-400">*</span>
          </label>
          <input
            id="video_duration_minutes"
            name="video_duration_minutes"
            type="number"
            min={5}
            defaultValue={5}
            required
            className="w-full h-12 px-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] placeholder-[#A69D8C]/50 focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors"
          />
          <p className="text-xs text-[#D2B277] font-medium mt-1">
            ⚠️ {siteConfig.video.minDurationNote}
          </p>
          {state?.fieldErrors?.video_duration_minutes && (
            <p className="text-xs text-red-400 font-medium">{state.fieldErrors.video_duration_minutes}</p>
          )}
        </div>
      )}

      {/* Project Details Field */}
      <div className="space-y-1.5">
        <label htmlFor="project_details" className="block text-xs uppercase tracking-widest text-[#F3EEE4] font-medium">
          Project Details <span className="text-[#A69D8C]/60 text-[10px] font-normal">(Optional, max 1000 chars)</span>
        </label>
        <textarea
          id="project_details"
          name="project_details"
          rows={4}
          maxLength={1000}
          placeholder="Tell us about your brand goals, target timeline, or special requirements..."
          className="w-full p-4 bg-[#0A0908] border border-[#D2B277]/25 rounded text-[#F3EEE4] placeholder-[#A69D8C]/50 focus:outline-none focus:border-[#D2B277] focus:ring-1 focus:ring-[#D2B277] text-sm transition-colors resize-y"
        />
        {state?.fieldErrors?.project_details && (
          <p className="text-xs text-red-400 font-medium">{state.fieldErrors.project_details}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-14 bg-[#D2B277] text-[#0A0908] text-sm font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-[#0A0908]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <span>Request Consultation &rarr;</span>
        )}
      </button>
    </form>
  );
}
