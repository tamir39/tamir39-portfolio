import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";

const BASE = "https://tamir39.vercel.app";

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
