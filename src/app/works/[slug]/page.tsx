import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const revalidate = 60;

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

interface CaseStudyData {
  id: string;
  title: string;
  slug: string;
  category: "website" | "video";
  client_name?: string | null;
  summary?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  thumbnail_url?: string | null;
  video_url?: string | null;
  live_url?: string | null;
  published: boolean;
}

// Fallback sample data matching Appendix C
const sampleCaseStudies: Record<string, CaseStudyData> = {
  "sample-luxury-restaurant": {
    id: "sample-1",
    title: "Sample Luxury Restaurant Site",
    slug: "sample-luxury-restaurant",
    category: "website",
    client_name: "Sample Client",
    summary: "A dark, cinematic restaurant website with online enquiry.",
    challenge: "The client needed a premium online presence.",
    solution: "We designed and built a fast multi-page site.",
    result: "Delivered in 2 weeks with enquiry form.",
    thumbnail_url: "/images/sample-luxury-restaurant.svg",
    live_url: "https://example.com",
    published: true,
  },
  "sample-brand-film": {
    id: "sample-2",
    title: "Sample Brand Film",
    slug: "sample-brand-film",
    category: "video",
    client_name: "Sample Brand",
    summary: "A 6-minute brand story edited for web.",
    challenge: "Raw footage needed a clear story.",
    solution: "We cut, graded and added sound design.",
    result: "Final film delivered for YouTube.",
    thumbnail_url: "/images/sample-brand-film.svg",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    published: true,
  },
};

export async function generateMetadata({ params }: CaseStudyProps) {
  const { slug } = await params;
  let work: CaseStudyData | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      work = data as CaseStudyData | null;
    } catch {
      work = null;
    }
  }

  if (!work && sampleCaseStudies[slug]) {
    work = sampleCaseStudies[slug];
  }

  if (!work) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: work.title,
    description: work.summary || work.title,
    alternates: {
      canonical: `/works/${work.slug}`,
    },
    openGraph: {
      title: `${work.title} | BMASRM.digital`,
      description: work.summary || "",
      images: work.thumbnail_url ? [work.thumbnail_url] : [],
    },
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  let work: CaseStudyData | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      work = data as CaseStudyData | null;
    } catch {
      work = null;
    }
  }

  if (!work && sampleCaseStudies[slug]) {
    work = sampleCaseStudies[slug];
  }

  if (!work || !work.published) {
    notFound();
  }

  const ytEmbedUrl = work.video_url ? getYouTubeEmbedUrl(work.video_url) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Back button */}
      <div>
        <Link
          href="/works"
          className="text-xs font-bold uppercase tracking-widest text-[#D2B277] hover:underline inline-flex items-center gap-2"
        >
          &larr; Back to Works
        </Link>
      </div>

      {/* Case Study Header */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          <span className="px-3 py-1 rounded-full bg-[#11100D] border border-[#D2B277]/30">
            {work.category === "website" ? "Website Building" : "Video Editing"}
          </span>
          {work.client_name && <span>Client: {work.client_name}</span>}
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-[#F3EEE4] leading-tight">
          {work.title}
        </h1>

        {work.summary && (
          <p className="text-lg text-[#A69D8C] max-w-3xl leading-relaxed">
            {work.summary}
          </p>
        )}

        {work.live_url && (
          <div className="pt-2">
            <a
              href={work.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all shadow-lg"
            >
              Visit Live Website &rarr;
            </a>
          </div>
        )}
      </section>

      {/* Main Media Section */}
      <section className="space-y-8">
        {ytEmbedUrl ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#D2B277]/20 shadow-2xl bg-[#11100D]">
            <iframe
              src={ytEmbedUrl}
              title={work.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        ) : work.thumbnail_url ? (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#D2B277]/20 shadow-2xl bg-[#11100D]">
            <Image
              src={work.thumbnail_url}
              alt={work.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover"
            />
          </div>
        ) : null}
      </section>

      {/* Challenge, Solution, Result Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#D2B277]/15">
        {work.challenge && (
          <div className="bg-[#11100D] border border-[#D2B277]/15 p-6 rounded-2xl space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-[#D2B277] font-bold">
              The Challenge
            </h2>
            <p className="text-sm text-[#A69D8C] leading-relaxed">{work.challenge}</p>
          </div>
        )}

        {work.solution && (
          <div className="bg-[#11100D] border border-[#D2B277]/15 p-6 rounded-2xl space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-[#D2B277] font-bold">
              Our Solution
            </h2>
            <p className="text-sm text-[#A69D8C] leading-relaxed">{work.solution}</p>
          </div>
        )}

        {work.result && (
          <div className="bg-[#11100D] border border-[#D2B277]/15 p-6 rounded-2xl space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-[#D2B277] font-bold">
              The Result
            </h2>
            <p className="text-sm text-[#A69D8C] leading-relaxed">{work.result}</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 pt-12 border-t border-[#D2B277]/15">
        <h2 className="font-heading text-3xl font-bold text-[#F3EEE4]">
          Inspired by this Case Study?
        </h2>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-all"
          >
            Start Your Project &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
