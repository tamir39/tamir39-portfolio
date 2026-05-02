import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";

const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    ...projects.map((p) => ({
      url: `${BASE}/missions/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
