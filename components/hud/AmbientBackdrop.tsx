"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

export function AmbientBackdrop() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const src = isDark
    ? "/tamir-background-darkmode.png"
    : "/tamir-background-lightmode.png";
  const opacity = isDark ? 0.55 : 0.85;
  const overlay = isDark
    ? "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.88) 100%)"
    : "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(236,236,228,0.45) 55%, rgba(236,236,228,0.7) 100%)";

  return (
    <div suppressHydrationWarning>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover"
          style={{
            opacity,
            animation:
              "circuit-breath 16s ease-in-out infinite, circuit-pulse 8s ease-in-out infinite",
            willChange: "transform, filter",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: overlay }}
      />
    </div>
  );
}
