"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function AmbientVideo() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* autoplay blocked; harmless — stays paused */
      });
    }
  }, [reduced]);

  return (
    <>
      <video
        ref={ref}
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster=""
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          opacity: 0.22,
          filter: "grayscale(0.55) contrast(1.08) brightness(0.85)",
        }}
      >
        <source src="/tamir-video.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </>
  );
}
