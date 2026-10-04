import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ContactLinks } from "./ContactLinks";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0908] border-t border-[#D2B277]/15 text-[#A69D8C] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-[#F3EEE4]">
                {siteConfig.brand.name}
              </span>
            </Link>
            <p className="text-sm max-w-sm text-[#A69D8C] leading-relaxed">
              {siteConfig.brand.description}
            </p>
            <p className="text-xs text-[#A69D8C]/70 italic tracking-wider">
              {siteConfig.brand.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#F3EEE4] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services/website-building" className="hover:text-[#F3EEE4] transition-colors">
                  Website Building
                </Link>
              </li>
              <li>
                <Link href="/services/video-editing" className="hover:text-[#F3EEE4] transition-colors">
                  Video Editing
                </Link>
              </li>
              <li>
                <Link href="/works" className="hover:text-[#F3EEE4] transition-colors">
                  Works Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F3EEE4] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D2B277] font-semibold mb-4">
              Direct Contact
            </h3>
            <ContactLinks variant="vertical" className="mb-6" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[#D2B277]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A69D8C]/80 gap-4">
          <div>
            © {currentYear} {siteConfig.brand.name}. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#A69D8C]/60">
              Anonymous, first-party privacy analytics enabled (no cookies).
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
