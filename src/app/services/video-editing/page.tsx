import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WorkCard, WorkItem } from "@/components/site/WorkCard";
import { ContactLinks } from "@/components/site/ContactLinks";

export const metadata = {
  title: "Video Editing Services",
  description:
    "Professional long-form video editing for brand films, corporate stories, and business showcases (5 minutes and longer).",
  alternates: {
    canonical: "/services/video-editing",
  },
};

export const revalidate = 60;

const sampleVideoWorks: WorkItem[] = [
  {
    id: "sample-video-1",
    title: "Sample Brand Film",
    slug: "sample-brand-film",
    category: "video",
    client_name: "Sample Brand",
    summary: "A 6-minute brand story edited for web with color grading and sound design.",
    thumbnail_url: "/images/sample-brand-film.svg",
  },
];

export default async function VideoEditingPage() {
  let videoWorks: WorkItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .eq("category", "video")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        videoWorks = data as WorkItem[];
      }
    } catch {
      videoWorks = [];
    }
  }

  const displayVideoWorks = videoWorks.length > 0 ? videoWorks : sampleVideoWorks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Video Production & Editing
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F3EEE4]">
          Cinematic Long-Form Video
        </h1>
        <p className="text-base sm:text-lg text-[#A69D8C] leading-relaxed">
          High-end video post-production tailored for ambitious brands and business leaders looking for impactful storytelling.
        </p>
      </section>

      {/* Mandatory Highlighted Note */}
      <section className="max-w-3xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#11100D] border border-[#D2B277] text-center space-y-2 shadow-lg">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D2B277]">
            Important Studio Policy
          </span>
          <p className="text-base sm:text-lg font-bold text-[#F3EEE4]">
            ⚠️ {siteConfig.video.minDurationNote}
          </p>
          <p className="text-xs text-[#A69D8C]">
            We focus exclusively on long-form, cinematic storytelling (5 min+). Project costs vary based on raw footage length, visual complexity, and motion graphics.
          </p>
        </div>
      </section>

      {/* Video Types */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
            Video Categories
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
            What We Edit
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          {[
            "Promotional Films",
            "Business Showcases",
            "Product Demonstrations",
            "Brand Documentaries",
            "Corporate Stories",
            "Social Media (Long-Form)",
          ].map((type) => (
            <div
              key={type}
              className="p-5 bg-[#11100D] border border-[#D2B277]/15 rounded-xl text-xs sm:text-sm font-semibold text-[#F3EEE4] tracking-wide"
            >
              {type}
            </div>
          ))}
        </div>
      </section>

      {/* Published Video Works */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <span className="block text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
            Recent Video Works
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
            Featured Editing Case Studies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayVideoWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-8 p-10 bg-[#11100D] border border-[#D2B277]/20 rounded-3xl">
        <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
          Have a Video Project in Mind?
        </h2>
        <p className="text-sm text-[#A69D8C] max-w-md mx-auto">
          Request video editing consultation below and our video director will follow up with you directly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact?service=video"
            className="px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-xl"
          >
            Request Video Editing &rarr;
          </Link>
        </div>
        <div className="pt-4 flex justify-center">
          <ContactLinks variant="buttons" />
        </div>
      </section>
    </div>
  );
}
