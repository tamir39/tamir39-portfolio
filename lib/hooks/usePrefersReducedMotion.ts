"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  // The browser's first render must match SSR; read the device preference only
  // after hydration. CSS handles reduced motion before this effect runs.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
