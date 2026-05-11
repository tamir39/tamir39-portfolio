import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "shrug-person-78902957.figma.site" },
      { protocol: "https", hostname: "images.higgs.ai" },
    ],
  },
};

export default nextConfig;
