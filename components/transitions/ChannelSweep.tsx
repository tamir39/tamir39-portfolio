"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useActiveSection } from "@/components/providers/ActiveSectionProvider";
import { findChannel } from "@/lib/data/nav";

export function ChannelSweep() {
  const active = useActiveSection();
  const firstRef = useRef(true);
  const lastScrollRef = useRef(0);
  const animatingRef = useRef(false);
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [channelId, setChannelId] = useState("MAIN_00");

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      lastScrollRef.current = window.scrollY;
      return;
    }
    if (animatingRef.current) {
      // still queue label/direction, but skip new animation until prior settles
      lastScrollRef.current = window.scrollY;
      setChannelId(findChannel(active).channelId);
      return;
    }
    const y = window.scrollY;
    setDirection(y >= lastScrollRef.current ? "down" : "up");
    lastScrollRef.current = y;
    setChannelId(findChannel(active).channelId);
    setTick((t) => t + 1);
    animatingRef.current = true;
    window.setTimeout(() => {
      animatingRef.current = false;
    }, 480);
  }, [active]);

  if (tick === 0) return null;

  const fromTop = direction === "down" ? "-4%" : "104%";
  const toTop = direction === "down" ? "104%" : "-4%";

  return (
    <motion.div
      key={tick}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[90]"
      initial={{ top: fromTop, opacity: 1 }}
      animate={{ top: toTop, opacity: [1, 1, 0] }}
      transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], times: [0, 0.75, 1] }}
    >
      <div className="relative">
        <div
          className="h-px w-full bg-cyan"
          style={{ boxShadow: "0 0 24px var(--color-cyan), 0 0 48px var(--color-cyan-soft)" }}
        />
        <div className="absolute left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">
          {`// CHANNEL :: ${channelId}`}
        </div>
      </div>
    </motion.div>
  );
}
