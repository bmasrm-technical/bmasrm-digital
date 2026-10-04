"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Website Building", href: "/services/website-building" },
    { name: "Video Editing", href: "/services/video-editing" },
    { name: "Works", href: "/works" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0908]/90 backdrop-blur-md border-b border-[#D2B277]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#F3EEE4] group-hover:text-[#D2B277] transition-colors">
            {siteConfig.brand.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-widest font-medium transition-colors ${
                  active ? "text-[#D2B277]" : "text-[#A69D8C] hover:text-[#F3EEE4]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Start a Project Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#e0c48e] transition-colors shadow-sm"
          >
            Start a Project
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          className="md:hidden p-2 text-[#A69D8C] hover:text-[#D2B277] focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#11100D] border-b border-[#D2B277]/20 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium py-2 uppercase tracking-wider ${
                isActive(link.href) ? "text-[#D2B277]" : "text-[#A69D8C] hover:text-[#F3EEE4]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-5 py-3 bg-[#D2B277] text-[#0A0908] text-xs font-bold uppercase tracking-widest rounded"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
