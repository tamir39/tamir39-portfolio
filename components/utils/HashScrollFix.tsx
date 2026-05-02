"use client";

import { useEffect } from "react";

/**
 * On home-page mount, if the URL has a hash, scroll the matching section
 * into view. We retry on rAF and at 150ms / 600ms to handle layout shifts
 * caused by images, fonts, and section content settling — without that,
 * Next.js's initial scroll fires before sections reach their final height
 * and the user lands on the wrong section (e.g. Profile instead of
 * Missions when coming back from a project page).
 */
export function HashScrollFix() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return;
    const id = hash.slice(1);

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const raf = requestAnimationFrame(scroll);
    const t1 = window.setTimeout(scroll, 150);
    const t2 = window.setTimeout(scroll, 600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
