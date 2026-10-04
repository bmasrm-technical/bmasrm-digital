import React from "react";
import Link from "next/link";
import { ContactLinks } from "@/components/site/ContactLinks";

export const metadata = {
  title: "Thank You",
  description: "Your consultation request has been submitted successfully.",
};

export default function ThankYouPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-10">
      <div className="w-16 h-16 bg-[#D2B277]/20 border border-[#D2B277] rounded-full flex items-center justify-center mx-auto text-[#D2B277]">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Request Received
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#F3EEE4]">
          Thank You
        </h1>
        {/* Enforced business rule text */}
        <p className="text-xl sm:text-2xl font-bold text-[#D2B277] max-w-xl mx-auto py-2 border-y border-[#D2B277]/20">
          We will call you within 24 hours.
        </p>
        <p className="text-sm text-[#A69D8C] max-w-md mx-auto leading-relaxed">
          Our team is reviewing your project details and will follow up with you directly by phone.
        </p>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-lg"
        >
          Return Home &rarr;
        </Link>
        <Link
          href="/works"
          className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#D2B277]/40 text-[#F3EEE4] hover:text-[#D2B277] hover:border-[#D2B277] text-xs font-bold uppercase tracking-widest rounded transition-all"
        >
          Browse Portfolio Works
        </Link>
      </div>

      <div className="pt-10 border-t border-[#D2B277]/15 space-y-4">
        <div className="text-xs uppercase tracking-widest text-[#A69D8C]">
          Or contact us directly
        </div>
        <div className="flex justify-center">
          <ContactLinks variant="buttons" />
        </div>
      </div>
    </div>
  );
}
