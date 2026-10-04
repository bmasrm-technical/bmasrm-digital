import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PlanCard } from "@/components/site/PlanCard";
import { ContactLinks } from "@/components/site/ContactLinks";

export const metadata = {
  title: "Website Building Services",
  description:
    "Bespoke luxury website development for ambitious businesses. Signature custom builds and ongoing monthly website management.",
  alternates: {
    canonical: "/services/website-building",
  },
};

export default function WebsiteBuildingPage() {
  const { signatureBuild, managedWebsite } = siteConfig.plans;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Web Development Services
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F3EEE4]">
          Bespoke Luxury Websites
        </h1>
        <p className="text-base sm:text-lg text-[#A69D8C] leading-relaxed">
          Websites are built to your unique brand requirements—never sold as rigid templates.
          We engineer landing pages, business platforms, portfolio sites, and custom luxury web experiences.
        </p>
      </section>

      {/* Project Types */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {[
          "Business Websites",
          "Landing Pages",
          "Portfolio Websites",
          "E-Commerce",
          "Custom Web Apps",
          "Luxury Brand Sites",
        ].map((type) => (
          <div
            key={type}
            className="p-4 bg-[#11100D] border border-[#D2B277]/15 rounded-xl text-xs sm:text-sm font-semibold text-[#F3EEE4] tracking-wide"
          >
            {type}
          </div>
        ))}
      </section>

      {/* Plan Cards Comparison */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
            Choose Your Model
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
            Signature Build vs Managed Website
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PlanCard plan={signatureBuild} />
          <PlanCard plan={managedWebsite} highlighted />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-8 p-10 bg-[#11100D] border border-[#D2B277]/20 rounded-3xl">
        <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
          Ready to Start Your Website Project?
        </h2>
        <p className="text-sm text-[#A69D8C] max-w-md mx-auto">
          Contact our team to discuss your goals and receive a custom proposal tailored to your requirements.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact?service=website"
            className="px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-xl"
          >
            Request Website Consultation &rarr;
          </Link>
        </div>
        <div className="pt-4 flex justify-center">
          <ContactLinks variant="buttons" />
        </div>
      </section>
    </div>
  );
}
