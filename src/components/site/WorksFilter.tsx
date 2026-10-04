"use client";

import React, { useState } from "react";
import { WorkCard, WorkItem } from "./WorkCard";

interface WorksFilterProps {
  works: WorkItem[];
}

export function WorksFilter({ works }: WorksFilterProps) {
  const [filter, setFilter] = useState<"all" | "website" | "video">("all");

  const filteredWorks = works.filter((w) => {
    if (filter === "all") return true;
    return w.category === filter;
  });

  return (
    <div className="space-y-10">
      {/* Filter Chips */}
      <div className="flex items-center justify-center space-x-3">
        {(["all", "website", "video"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
              filter === cat
                ? "bg-[#D2B277] text-[#0A0908] border-[#D2B277] shadow-lg"
                : "bg-[#11100D] text-[#A69D8C] border-[#D2B277]/20 hover:border-[#D2B277]/50 hover:text-[#F3EEE4]"
            }`}
          >
            {cat === "all" ? "All Works" : cat === "website" ? "Websites" : "Videos"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#A69D8C]">
          No works found in this category.
        </div>
      )}
    </div>
  );
}
