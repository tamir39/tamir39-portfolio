import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";

const BASE = "https://tamir39.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/profile`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/missions`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/transmission`, lastModified: now, priority: 0.8 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/missions/${p.slug}`,
    lastModified: now,
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes];
}
