import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WorkCard, WorkItem } from "@/components/site/WorkCard";
import { ContactLinks } from "@/components/site/ContactLinks";
import { HomeBackground3D } from "@/components/site/HomeBackground3D";
import { HomeIntroWrapper } from "@/components/intro/HomeIntroWrapper";

export const revalidate = 60;

// Sample fallback works if database has no published works yet
const sampleWorks: WorkItem[] = [
  {
    id: "sample-1",
    title: "Sample Luxury Restaurant Site",
    slug: "sample-luxury-restaurant",
    category: "website",
    client_name: "Sample Client",
    summary: "A dark, cinematic restaurant website with online consultation enquiry.",
    thumbnail_url: "/images/sample-luxury-restaurant.svg",
  },
  {
    id: "sample-2",
    title: "Sample Brand Film",
    slug: "sample-brand-film",
    category: "video",
    client_name: "Sample Brand",
    summary: "A 6-minute cinematic brand story edited for high-class digital web presence.",
    thumbnail_url: "/images/sample-brand-film.svg",
  },
];

export default async function Home() {
  let worksList: WorkItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        worksList = data as WorkItem[];
      }
    } catch {
      worksList = [];
    }
  }

  // Section 6.2 #3: If none exist show a tasteful placeholder, not an empty gap.
  const displayWorks = worksList.length > 0 ? worksList : sampleWorks;

  return (
    <div className="relative min-h-screen bg-[#0A0908]">
      {/* Client 3D Intro Gate (Overlay) */}
      <HomeIntroWrapper />

      {/* 3D Interactive Background */}
      <HomeBackground3D />

      {/* Main Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16 md:py-24">
        {/* 1. Hero Section */}
        <section className="relative text-center pt-8 md:pt-16 pb-8 space-y-8 max-w-4xl mx-auto">
          {/* Emblem Background Artwork */}
          <div className="absolute inset-0 -top-8 sm:-top-16 flex items-center justify-center pointer-events-none -z-10 overflow-visible">
            <div
              className="w-[380px] h-[380px] sm:w-[580px] sm:h-[580px] md:w-[700px] md:h-[700px] rounded-full bg-cover bg-center opacity-35 sm:opacity-45 select-none shadow-[0_0_120px_rgba(210,178,119,0.2)]"
              style={{
                backgroundImage: "url('/images/bmasrm-hero-emblem.jpg')",
                maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 78%)",
                WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 78%)",
              }}
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D2B277]/30 bg-[#11100D]/80 backdrop-blur-sm text-[#D2B277] text-xs font-semibold uppercase tracking-widest shadow-lg">
            <span>{siteConfig.brand.tagline}</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F3EEE4] leading-[1.1] drop-shadow-md">
            Cinematic Web & <br />
            <span className="text-[#D2B277]">Video Experiences</span>
          </h1>

          <p className="text-base sm:text-xl text-[#A69D8C] leading-relaxed max-w-2xl mx-auto drop-shadow">
            {siteConfig.brand.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/works"
              className="w-full sm:w-auto px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-xl hover:scale-105"
            >
              Explore Works &rarr;
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#11100D]/60 backdrop-blur-sm border border-[#D2B277]/40 text-[#F3EEE4] hover:text-[#D2B277] hover:border-[#D2B277] text-xs font-bold uppercase tracking-widest rounded transition-all"
            >
              Start a Project
            </Link>
          </div>
        </section>

        {/* 2. Services Teaser */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
              Our Craft
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F3EEE4]">
              Two Pillars of Luxury Presentation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#11100D] border border-[#D2B277]/20 p-8 sm:p-10 rounded-2xl space-y-6 hover:border-[#D2B277]/50 transition-all group">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D2B277]">
                01 / Web Development
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F3EEE4] group-hover:text-[#D2B277] transition-colors">
                Website Building
              </h3>
              <p className="text-sm text-[#A69D8C] leading-relaxed">
                Custom business websites, landing pages, portfolio platforms, and luxury brand experiences engineered with speed, security, and elegance.
              </p>
              <Link
                href="/services/website-building"
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#D2B277] group-hover:translate-x-1 transition-transform"
              >
                Learn More About Websites &rarr;
              </Link>
            </div>

            <div className="bg-[#11100D] border border-[#D2B277]/20 p-8 sm:p-10 rounded-2xl space-y-6 hover:border-[#D2B277]/50 transition-all group">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D2B277]">
                02 / Video Editing
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F3EEE4] group-hover:text-[#D2B277] transition-colors">
                Video Experiences
              </h3>
              <p className="text-sm text-[#A69D8C] leading-relaxed">
                High-end long-form video editing for brand films, corporate stories, product showcases, and business presentations (5 minutes and longer).
              </p>
              <Link
                href="/services/video-editing"
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#D2B277] group-hover:translate-x-1 transition-transform"
              >
                Learn More About Video Editing &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Featured Works */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D2B277]/15 pb-6">
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
                Portfolio Showcase
              </span>
              <h2 className="font-heading text-3xl font-bold text-[#F3EEE4] mt-1">
                Featured Works
              </h2>
            </div>
            <Link
              href="/works"
              className="text-xs font-bold uppercase tracking-widest text-[#D2B277] hover:underline"
            >
              View All Works &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

        {/* 4. How We Work */}
        <section className="bg-[#11100D]/80 border border-[#D2B277]/20 p-8 sm:p-12 rounded-3xl space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
              Workflow & Process
            </span>
            <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
              How We Work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Requirements",
                desc: "In-depth consultation to map your objectives, vision, and specs.",
              },
              {
                step: "02",
                title: "Design",
                desc: "Crafting bespoke dark, cinematic visual aesthetics and layout prototypes.",
              },
              {
                step: "03",
                title: "Development",
                desc: "Building with performant, robust modern tech stack and strict standards.",
              },
              {
                step: "04",
                title: "Delivery",
                desc: "Testing, deployment, domain setup, and complete client handover.",
              },
            ].map((item) => (
              <div key={item.step} className="p-6 bg-[#0A0908] border border-[#D2B277]/15 rounded-xl space-y-3">
                <span className="font-heading text-2xl font-bold text-[#D2B277]">
                  {item.step}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#F3EEE4]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A69D8C] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Plans Teaser */}
        <section className="text-center space-y-8 bg-gradient-to-b from-[#11100D] to-[#0A0908] p-8 sm:p-12 rounded-3xl border border-[#D2B277]/20">
          <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
            Signature Build or Managed Website?
          </h2>
          <p className="text-sm text-[#A69D8C] max-w-2xl mx-auto">
            Choose between a custom one-time project build or our ongoing monthly website management service.
          </p>
          <div>
            <Link
              href="/services/website-building"
              className="inline-flex items-center px-6 py-3 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all"
            >
              Compare Website Plans &rarr;
            </Link>
          </div>
        </section>

        {/* 6. Final Call to Action */}
        <section className="text-center space-y-8 py-8 border-t border-[#D2B277]/15">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F3EEE4]">
            Ready to Build Your Presence?
          </h2>
          <p className="text-sm text-[#A69D8C] max-w-md mx-auto">
            Book a direct consultation or reach out directly to discuss your project requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-xl"
            >
              Request a Consultation &rarr;
            </Link>
          </div>

          <div className="pt-4 flex justify-center">
            <ContactLinks variant="buttons" />
          </div>
        </section>
      </div>
    </div>
  );
}
