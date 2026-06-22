import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/video-generation-api-pricing",
    "/seedance-2-pricing-calculator",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-06-22T00:00:00Z"),
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.includes("seedance") ? 0.9 : 0.8,
  }));
}
