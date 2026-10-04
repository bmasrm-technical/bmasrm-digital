import { MetadataRoute } from "next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services/website-building`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/video-editing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: works } = await supabase
        .from("works")
        .select("slug, updated_at")
        .eq("published", true);

      if (works && works.length > 0) {
        dynamicRoutes = works.map((work) => ({
          url: `${baseUrl}/works/${work.slug}`,
          lastModified: new Date(work.updated_at || Date.now()),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    } catch {
      // Ignore
    }
  }

  if (dynamicRoutes.length === 0) {
    dynamicRoutes = [
      {
        url: `${baseUrl}/works/sample-luxury-restaurant`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/works/sample-brand-film`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ];
  }

  return [...staticRoutes, ...dynamicRoutes];
}
