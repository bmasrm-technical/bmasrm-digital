import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-8">
      <span className="font-heading text-8xl font-bold text-[#D2B277]/30 block">
        404
      </span>

      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-bold text-[#F3EEE4]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#A69D8C]">
          The page or case study you are looking for does not exist or has been moved.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3.5 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-lg"
        >
          Back to Studio Home &rarr;
        </Link>
      </div>
    </div>
  );
}
