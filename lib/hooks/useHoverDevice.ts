"use client";

import { useEffect, useState } from "react";

export function useHoverDevice(): boolean {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return hover;
}
