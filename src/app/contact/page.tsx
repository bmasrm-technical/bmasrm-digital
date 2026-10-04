import React from "react";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { ContactLinks } from "@/components/site/ContactLinks";

export const metadata = {
  title: "Request a Consultation",
  description:
    "Start your project with BMASRM.digital. Submit a consultation request for custom website building or long-form video editing.",
  alternates: {
    canonical: "/contact",
  },
};

interface ContactPageProps {
  searchParams: Promise<{ service?: string; plan?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service, plan } = await searchParams;

  const validService = service === "video" ? "video" : "website";
  const validPlan =
    plan === "signature_build" || plan === "managed_website" ? plan : "not_sure";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Get In Touch
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F3EEE4]">
          Start Your Project
        </h1>
        <p className="text-base text-[#A69D8C] leading-relaxed">
          Fill out the consultation form below, or reach out directly through WhatsApp, Instagram, or Email.
        </p>
      </section>

      {/* Form */}
      <section>
        <ConsultationForm initialService={validService} initialPlan={validPlan} />
      </section>

      {/* Direct Contact Links */}
      <section className="text-center space-y-6 pt-10 border-t border-[#D2B277]/15">
        <h2 className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Prefer Direct Contact?
        </h2>
        <div className="flex justify-center">
          <ContactLinks variant="buttons" />
        </div>
      </section>
    </div>
  );
}
