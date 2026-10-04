"use client";

import React from "react";
import { siteConfig } from "@/config/site";

interface IntroProps {
  onComplete: () => void;
}

export default function Intro3D({ onComplete }: IntroProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0908] overflow-hidden select-none">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/bmasrm-hero-emblem.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="/videos/intro-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/20 via-transparent to-[#0A0908]/90" />

      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-10 px-4 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D2B277]/30 bg-[#11100D]/80 backdrop-blur-md text-[#D2B277] text-xs font-semibold uppercase tracking-widest shadow-xl">
          <span>{siteConfig.brand.tagline}</span>
        </div>

        {/* Center branding */}
        <div className="space-y-3 mt-auto mb-4 pointer-events-none drop-shadow-2xl">
          <p className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F3EEE4] drop-shadow-xl">
            {siteConfig.brand.name}
          </p>
          <p className="text-xs sm:text-sm text-[#A69D8C] max-w-sm mx-auto font-light tracking-wide">
            {siteConfig.brand.description}
          </p>
        </div>

        {/* Enter Button */}
        <div className="pointer-events-auto pb-6">
          <button
            onClick={onComplete}
            className="group px-9 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-[0_0_35px_rgba(210,178,119,0.4)] hover:shadow-[0_0_50px_rgba(210,178,119,0.7)] hover:scale-105 active:scale-95 flex items-center gap-2.5"
          >
            <span>Enter Studio</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
