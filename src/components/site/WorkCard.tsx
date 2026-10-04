import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface WorkItem {
  id: string;
  title: string;
  slug: string;
  category: "website" | "video";
  client_name?: string | null;
  summary?: string | null;
  thumbnail_url?: string | null;
  featured?: boolean;
  published?: boolean;
}

interface WorkCardProps {
  work: WorkItem;
}

export function WorkCard({ work }: WorkCardProps) {
  const defaultThumbnail = work.category === "video" 
    ? "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

  const thumbnail = work.thumbnail_url || defaultThumbnail;

  return (
    <Link
      href={`/works/${work.slug}`}
      className="group block bg-[#11100D] border border-[#D2B277]/18 rounded-2xl overflow-hidden hover:border-[#D2B277]/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0908]">
        <Image
          src={thumbnail}
          alt={work.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 bg-[#0A0908]/80 backdrop-blur-md border border-[#D2B277]/30 text-[#D2B277] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
          {work.category === "website" ? "Website Building" : "Video Editing"}
        </div>
      </div>

      <div className="p-6 space-y-3">
        {work.client_name && (
          <div className="text-xs uppercase tracking-wider text-[#A69D8C]">
            {work.client_name}
          </div>
        )}

        <h3 className="font-heading text-xl font-bold text-[#F3EEE4] group-hover:text-[#D2B277] transition-colors">
          {work.title}
        </h3>

        {work.summary && (
          <p className="text-sm text-[#A69D8C] line-clamp-2 leading-relaxed">
            {work.summary}
          </p>
        )}

        <div className="pt-2 flex items-center text-xs font-bold uppercase tracking-widest text-[#D2B277] group-hover:translate-x-1 transition-transform">
          View Case Study &rarr;
        </div>
      </div>
    </Link>
  );
}
