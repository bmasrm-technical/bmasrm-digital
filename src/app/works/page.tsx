import React from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WorkItem } from "@/components/site/WorkCard";
import { WorksFilter } from "@/components/site/WorksFilter";

export const metadata = {
  title: "Works & Case Studies",
  description: "Explore our portfolio of high-class luxury website builds and long-form video experiences.",
  alternates: {
    canonical: "/works",
  },
};

export const revalidate = 60;

const sampleWorks: WorkItem[] = [
  {
    id: "sample-1",
    title: "Sample Luxury Restaurant Site",
    slug: "sample-luxury-restaurant",
    category: "website",
    client_name: "Sample Client",
    summary: "A dark, cinematic restaurant website with online consultation enquiry.",
    thumbnail_url: "/images/sample-luxury-restaurant.svg",
    published: true,
  },
  {
    id: "sample-2",
    title: "Sample Brand Film",
    slug: "sample-brand-film",
    category: "video",
    client_name: "Sample Brand",
    summary: "A 6-minute brand story edited for web.",
    thumbnail_url: "/images/sample-brand-film.svg",
    published: true,
  },
];

export default async function WorksPage() {
  let worksList: WorkItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        worksList = data as WorkItem[];
      }
    } catch {
      worksList = [];
    }
  }

  const displayWorks = worksList.length > 0 ? worksList : sampleWorks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold">
          Portfolio
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F3EEE4]">
          Our Selected Works
        </h1>
        <p className="text-base text-[#A69D8C]">
          Explore custom website designs and cinematic video projects crafted for ambitious brands.
        </p>
      </section>

      <WorksFilter works={displayWorks} />
    </div>
  );
}
