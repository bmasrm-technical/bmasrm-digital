
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_ID = "G-MRMMD1X7PG";

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (window.navigator.doNotTrack === "1") return;

    // Keep the existing anonymous tracking
    try {
      let visitorId = localStorage.getItem("bmasrm_vid");

      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("bmasrm_vid", visitorId);
      }

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, path: pathname }),
      }).catch(() => {});
    } catch {
      // Storage may be unavailable
    }
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
