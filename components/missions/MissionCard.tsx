"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { StatusPill } from "./StatusPill";
import { TechTag } from "./TechTag";
import { useHoverDevice } from "@/lib/hooks/useHoverDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const TILT = 8;

export function MissionCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const hoverDevice = useHoverDevice();
  const reduced = usePrefersReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 22 });
  const sy = useSpring(py, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [TILT, -TILT]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT, TILT]);

  // rAF-throttled pointer tracking — pointermove on some devices fires up to
  // ~1000Hz; we only need 60Hz to drive the spring smoothly.
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverDevice || reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    pendingRef.current = {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRef.current) {
        px.set(pendingRef.current.x);
        py.set(pendingRef.current.y);
      }
    });
  };

  const handleLeave = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: [0.65, 0, 0.35, 1] }}
      style={{
        transformStyle: "preserve-3d",
        rotateX: hoverDevice && !reduced ? rotateX : 0,
        rotateY: hoverDevice && !reduced ? rotateY : 0,
      }}
      className="group relative"
    >
      <Link
        href={`/missions/${project.slug}`}
        className="block focus:outline-none"
      >
        <div
          className="glass-strong relative flex h-full flex-col gap-4 overflow-hidden px-5 py-5 transition-all duration-300 group-hover:border-cyan"
          style={{ transform: "translateZ(0)" }}
        >
          {/* corner brackets */}
          <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-cyan opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-cyan opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* hover glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow:
                "0 0 0 1px var(--color-cyan), 0 0 28px var(--color-cyan-soft) inset",
            }}
          />

          {/* top-edge sweeping scanline on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-2 top-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 group-hover:scale-x-100"
            style={{ boxShadow: "0 0 8px var(--color-cyan)" }}
          />

          <header className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-glow-cyan text-hud-label text-cyan">{project.id}</span>
              <h3 className="text-glow-cyan font-display text-xl leading-tight tracking-tight">
                {project.name}
              </h3>
            </div>
            <StatusPill status={project.status} />
          </header>

          <p className="text-sm leading-relaxed text-text-soft">{project.tagline}</p>

          <div className="mt-auto flex flex-col gap-2">
            <span className="text-hud-label text-text-dim">{project.dates}</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <TechTag key={s}>{s}</TechTag>
              ))}
            </div>
          </div>

          <span className="mt-1 inline-flex items-center gap-1 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ▸ open log
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
