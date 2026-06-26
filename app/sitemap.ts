import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/video-generation-api-pricing",
    "/seedance-2-api-cost-per-second",
    "/seedance-2-cost-per-minute",
    "/seedance-2-cheapest-api",
    "/seedance-2-pricing-calculator",
    "/seedance-2-5-pricing",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-06-23T00:00:00Z"),
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.includes("seedance") ? 0.9 : 0.8,
  }));
}
