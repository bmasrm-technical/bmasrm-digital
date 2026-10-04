import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Tracker } from "@/components/analytics/Tracker";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BMASRM.digital | Premium Digital Studio",
    template: "%s | BMASRM.digital",
  },
  description:
    "BMASRM.digital is a premium digital studio that builds high-class websites and professional video experiences for ambitious businesses.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BMASRM.digital",
    title: "BMASRM.digital | Premium Digital Studio",
    description: "Premium digital studio building high-class websites and video experiences.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Section 4 requirement: check first three env vars on startup
  const requiredEnvVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: process.env.SUPABASE_SERVICE_ROLE_KEY },
  ];

  const missingVar = requiredEnvVars.find((v) => !v.value);

  if (missingVar) {
    return (
      <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
        <body className="bg-[#0A0908] text-[#F3EEE4] flex items-center justify-center min-h-screen p-6">
          <div className="max-w-md w-full bg-[#11100D] border border-red-900/50 p-8 rounded-xl shadow-2xl space-y-4">
            <h1 className="font-heading text-xl font-bold text-red-400">Environment Setup Error</h1>
            <p className="text-sm text-[#A69D8C]">
              Missing required environment variable:
            </p>
            <div className="bg-[#0A0908] border border-[#D2B277]/20 p-3 rounded text-amber-400 font-mono text-xs break-all">
              {missingVar.key}
            </div>
            <p className="text-xs text-[#A69D8C]">
              Please define this key in your <code className="text-[#D2B277]">.env.local</code> file to continue.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('bmasrm_intro_seen') === 'true') {
                  document.documentElement.classList.add('intro-seen');
                }
              } catch(e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BMASRM.digital",
              "url": "https://bmasrm.digital",
              "description": "Premium digital studio building high-class websites and professional video experiences."
            })
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.intro-seen #intro-overlay-container {
                display: none !important;
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#0A0908] text-[#F3EEE4] antialiased flex flex-col min-h-screen">
        <Tracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
