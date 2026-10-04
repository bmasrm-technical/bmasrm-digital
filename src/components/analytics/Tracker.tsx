"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function Tracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin routes
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    // Respect Do Not Track header
    if (typeof window !== "undefined" && window.navigator.doNotTrack === "1") {
      return;
    }

    // Avoid duplicate tracking of exact same path in single render pass
    if (lastTrackedPath.current === pathname) {
      return;
    }

    // Get or initialize anonymous visitor UUID
    let visitorId = localStorage.getItem("bmasrm_vid");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("bmasrm_vid", visitorId);
    }

    lastTrackedPath.current = pathname;

    // Send anonymous pageview event
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, path: pathname }),
    }).catch(() => {
      // Silent error catching for analytics
    });
  }, [pathname]);

  return null;
}
