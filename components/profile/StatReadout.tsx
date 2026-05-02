"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function StatReadout({
  label,
  value,
  suffix = "",
  decimals = 0,
  tone = "cyan",
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  tone?: "cyan" | "violet";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(value * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  const glow = tone === "violet" ? "text-glow-violet" : "text-glow-cyan";
  const accentBg = tone === "violet" ? "bg-violet" : "bg-cyan";
  const accentText = tone === "violet" ? "text-violet" : "text-cyan";

  return (
    <div ref={ref} className="relative flex flex-col gap-1.5 px-1 py-2">
      <span className="text-hud-label text-text-dim">{label}</span>
      <span className={`${glow} font-display text-4xl font-semibold tracking-tight md:text-5xl`}>
        {display.toFixed(decimals)}
        <span className={`ml-1 text-base ${accentText}`}>{suffix}</span>
      </span>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
        style={{ transformOrigin: "left" }}
        className={`block h-px w-12 ${accentBg}`}
      />
    </div>
  );
}
