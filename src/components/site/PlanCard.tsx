import React from "react";
import Link from "next/link";
import { PlanConfig } from "@/config/site";

interface PlanCardProps {
  plan: PlanConfig;
  highlighted?: boolean;
}

export function PlanCard({ plan, highlighted = false }: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${
        highlighted
          ? "bg-[#11100D] border-[#D2B277] shadow-[0_0_30px_rgba(210,178,119,0.1)]"
          : "bg-[#11100D]/70 border-[#D2B277]/20 hover:border-[#D2B277]/40"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D2B277] text-[#0A0908] text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full">
          Recommended
        </div>
      )}

      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
            {plan.subtitle}
          </span>
          <h3 className="font-heading text-2xl font-bold text-[#F3EEE4] mt-1">
            {plan.title}
          </h3>
        </div>

        <p className="text-sm text-[#F3EEE4] font-medium border-l-2 border-[#D2B277] pl-3 py-1 bg-[#0A0908]/50 rounded-r">
          &ldquo;{plan.idea}&rdquo;
        </p>

        <div className="space-y-4 text-xs text-[#A69D8C]">
          <div>
            <span className="block uppercase tracking-wider text-[#D2B277]/80 font-bold mb-1">
              Process
            </span>
            <p className="text-[#F3EEE4]/90">{plan.process}</p>
          </div>

          <div>
            <span className="block uppercase tracking-wider text-[#D2B277]/80 font-bold mb-1">
              What&apos;s Included
            </span>
            <p className="text-[#A69D8C] leading-relaxed">{plan.included}</p>
          </div>

          <div>
            <span className="block uppercase tracking-wider text-[#D2B277]/80 font-bold mb-1">
              After Support
            </span>
            <p className="text-[#A69D8C] leading-relaxed">{plan.afterSupport}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#D2B277]/15 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#A69D8C]">Pricing</div>
          <div className="text-lg font-bold text-[#D2B277]">{plan.priceText}</div>
          {plan.managedMonthlyFrom && (
            <div className="text-xs text-[#F3EEE4] font-semibold mt-1">
              Starting from {plan.managedMonthlyFrom}/mo
            </div>
          )}
        </div>

        <Link
          href={plan.buttonHref}
          className={`block w-full text-center py-3.5 px-4 rounded text-xs font-bold uppercase tracking-widest transition-all ${
            highlighted
              ? "bg-[#D2B277] text-[#0A0908] hover:bg-[#e0c48e]"
              : "bg-transparent border border-[#D2B277]/40 text-[#F3EEE4] hover:text-[#D2B277] hover:border-[#D2B277]"
          }`}
        >
          {plan.buttonText} &rarr;
        </Link>
      </div>
    </div>
  );
}
