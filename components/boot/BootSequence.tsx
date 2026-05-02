"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useBootStatus } from "@/components/providers/BootStatusProvider";

const SESSION_KEY = "tamir.boot.shown";
const TOTAL_MS = 1700;
const EXIT_MS = 450;

type BootLine = { at: number; text: string };

const BOOT_LINES: BootLine[] = [
  { at: 60, text: "▸ tamir.os v1.0 :: cold start" },
  { at: 280, text: "▸ loading core modules ........... OK" },
  { at: 480, text: "▸ linking neural-link ............ OK" },
  { at: 680, text: "▸ establishing uplink ............ OK" },
  { at: 880, text: "▸ identity: PHI VUONG TUONG TAM" },
  { at: 1100, text: "▸ all systems nominal — welcome." },
];

export function BootSequence() {
  const reduced = usePrefersReducedMotion();
  const { markBooted } = useBootStatus();
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already booted in this session — release gate immediately and unmount.
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setMounted(false);
      markBooted();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    // Reduced motion: very short scrim, no terminal animation.
    if (reduced) {
      setLineIndex(BOOT_LINES.length);
      setProgress(100);
      const t1 = window.setTimeout(() => setExiting(true), 300);
      const t2 = window.setTimeout(() => {
        setMounted(false);
        markBooted();
      }, 300 + EXIT_MS);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }

    const timers: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setLineIndex(i + 1), BOOT_LINES[i].at),
      );
    });

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / TOTAL_MS);
      setProgress(k * 100);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(window.setTimeout(() => setExiting(true), TOTAL_MS));
    timers.push(
      window.setTimeout(() => {
        setMounted(false);
        markBooted();
      }, TOTAL_MS + EXIT_MS),
    );

    const skip = () => {
      setExiting(true);
      window.setTimeout(() => {
        setMounted(false);
        markBooted();
      }, EXIT_MS);
    };
    window.addEventListener("click", skip);
    window.addEventListener("keydown", skip);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduced, markBooted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot-scrim"
          aria-hidden
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scaleY: 0.05 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "center" }}
        >
          {/* scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(0,229,255,0.08) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* corner brackets */}
          <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-cyan" />
          <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-cyan" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-cyan" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-cyan" />

          {/* top label */}
          <span className="absolute top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            // BOOT_SCREEN :: SYS_INIT
          </span>

          {/* avatar with spinning rings */}
          <div className="relative mb-10 h-28 w-28 md:h-36 md:w-36">
            <Image
              src="/tamir-avatar.png"
              alt=""
              fill
              priority
              sizes="144px"
              className="rounded-full"
              style={{ opacity: 0.95 }}
            />
            <span
              aria-hidden
              className="absolute inset-[-10px] rounded-full border border-cyan/60"
              style={{
                animation: "spin-slow 4s linear infinite",
                willChange: "transform",
                boxShadow: "0 0 16px var(--color-cyan-soft)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-[-22px] rounded-full border border-violet/40 border-dashed"
              style={{
                animation: "spin-slow-reverse 7s linear infinite",
                willChange: "transform",
              }}
            />
          </div>

          {/* TAMIR.OS title */}
          <div className="text-glow-cyan mb-6 font-display text-2xl font-semibold tracking-[0.4em] md:text-3xl">
            TAMIR.OS
          </div>

          {/* boot lines */}
          <div className="min-h-[150px] w-full max-w-md px-6 font-mono text-[11px] leading-[1.7]">
            {BOOT_LINES.slice(0, lineIndex).map((l, i) => (
              <div
                key={i}
                className={
                  i === lineIndex - 1 && lineIndex < BOOT_LINES.length
                    ? "text-cyan"
                    : "text-text-soft"
                }
              >
                {l.text}
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div className="mt-4 w-64">
            <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
              <span>BOOT</span>
              <span className="text-cyan">
                {Math.floor(progress).toString().padStart(3, "0")}%
              </span>
            </div>
            <div className="h-px w-full bg-stroke-bright">
              <div
                className="h-full bg-cyan"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 8px var(--color-cyan)",
                  transition: "width 0.06s linear",
                }}
              />
            </div>
          </div>

          {/* skip hint */}
          <div className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
            // PRESS ANY KEY TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
