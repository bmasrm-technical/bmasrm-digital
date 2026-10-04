"use client";

import React from "react";
import { siteConfig } from "@/config/site";

interface FallbackProps {
  onEnter: () => void;
}

export function Fallback({ onEnter }: FallbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0908] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1713] via-[#0A0908] to-[#050504] text-[#F3EEE4] px-4">
      <div className="text-center space-y-6 max-w-lg">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          {siteConfig.brand.tagline}
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F3EEE4]">
          {siteConfig.brand.name}
        </h1>
        <p className="text-sm text-[#A69D8C] max-w-sm mx-auto">
          {siteConfig.brand.description}
        </p>

        <div className="pt-4">
          <button
            onClick={onEnter}
            className="px-8 py-3.5 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-lg"
          >
            Enter Studio &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
