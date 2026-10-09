import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production verification from overwriting the running preview's cache.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  reactStrictMode: true,
  // Keep the local preview's corner controls clear of the development badge.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "shrug-person-78902957.figma.site" },
    ],
  },
};

export default nextConfig;
