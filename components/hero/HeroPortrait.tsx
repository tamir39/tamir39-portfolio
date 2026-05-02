"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function HeroPortrait() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const v = ref.current;
    const w = wrapRef.current;
    if (!v || !w) return;
    if (reduced) {
      v.pause();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {
              /* autoplay blocked */
            });
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(w);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
      className="relative aspect-square w-[260px] md:w-[340px]"
      style={{ willChange: "transform" }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 1px var(--color-violet), 0 0 60px var(--color-violet-soft)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 1, 0.85, 1] }}
        transition={{
          duration: 0.6,
          times: [0, 0.35, 0.45, 0.65, 1],
          delay: 0.15,
        }}
      />

      <div
        className="relative z-[1] h-full w-full overflow-hidden rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px var(--color-cyan-soft), inset 0 0 28px rgba(0,229,255,0.18)",
        }}
      >
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Tamir portfolio reel"
          className="h-full w-full object-cover"
          style={{ filter: "contrast(1.05) saturate(1.08)" }}
        >
          <source src="/tamir-video.mp4" type="video/mp4" />
        </video>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,229,255,0.06) 0 1px, transparent 1px 3px)",
            mixBlendMode: "overlay",
          }}
        />
        {/* REC marker inside the disc */}
        <span
          aria-hidden
          className="absolute right-4 top-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-cyan"
        >
          <span
            className="block h-1.5 w-1.5 rounded-full bg-cyan"
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              boxShadow: "0 0 6px var(--color-cyan)",
            }}
          />
          REC
        </span>
      </div>
    </motion.div>
  );
}
