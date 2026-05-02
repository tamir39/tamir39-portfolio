"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function GlitchText({
  children,
  as: Tag = "span",
  triggerOnHover = true,
  className = "",
}: {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  triggerOnHover?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();

  const trigger = triggerOnHover && !reduced ? () => setActive(true) : undefined;
  const stop = triggerOnHover && !reduced ? () => setActive(false) : undefined;

  return (
    <Tag
      className={`relative inline-block ${className}`}
      data-glitching={active ? "true" : "false"}
      onMouseEnter={trigger}
      onMouseLeave={stop}
      style={{
        animation: active ? "glitch-shift 0.18s steps(2) 1" : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
