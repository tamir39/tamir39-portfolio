"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { findChannel } from "@/lib/data/nav";

const DURATION_MS = 420;

export function ChannelSwitch() {
  const pathname = usePathname();
  const firstRef = useRef(true);
  const [tick, setTick] = useState(0);
  const [label, setLabel] = useState("Home");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    const ch = findChannel(pathname ?? "/");
    setLabel(`${ch.channelId} · ${ch.label}`);
    setTick((t) => t + 1);
    setActive(true);
    const id = window.setTimeout(() => setActive(false), DURATION_MS);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (!active) return null;

  return (
    <motion.div
      key={tick}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] origin-center overflow-hidden"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: [0, 1, 1, 0] }}
      transition={{
        duration: DURATION_MS / 1000,
        ease: [0.65, 0, 0.35, 1],
        times: [0, 0.3, 0.7, 1],
      }}
    >
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,229,255,0.10) 0 1px, transparent 1px 4px)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div
          className="mx-auto h-px w-72 bg-cyan"
          style={{ boxShadow: "0 0 24px var(--color-cyan)" }}
        />
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">
          {`→ ${label}`}
        </p>
      </div>
    </motion.div>
  );
}
