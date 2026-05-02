"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHoverDevice } from "@/lib/hooks/useHoverDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function HudCursor() {
  const hoverDevice = useHoverDevice();
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!hoverDevice) return;
    document.documentElement.classList.add("hud-cursor-on");
    return () => document.documentElement.classList.remove("hud-cursor-on");
  }, [hoverDevice]);

  useEffect(() => {
    if (!hoverDevice) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const hot = target?.closest<HTMLElement>(
        "a,button,[role='button'],[data-cursor]",
      );
      setActive(!!hot);
      setLabel(hot?.dataset.cursor ?? null);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hoverDevice, x, y]);

  if (!hoverDevice) return null;

  const size = active ? 36 : 16;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80]"
        style={{
          x: reduced ? x : sx,
          y: reduced ? y : sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{ width: size, height: size }}
          transition={{ duration: 0.18, ease: [0.65, 0, 0.35, 1] }}
          className="relative rounded-full border border-cyan"
          style={{
            boxShadow: "0 0 8px var(--color-cyan-soft)",
          }}
        >
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
          />
        </motion.div>
        {label ? (
          <span className="absolute left-6 top-6 whitespace-nowrap text-hud-label text-cyan">
            {`// ${label}`}
          </span>
        ) : null}
      </motion.div>
      <style jsx global>{`
        html.hud-cursor-on,
        html.hud-cursor-on * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
