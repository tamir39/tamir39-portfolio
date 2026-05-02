"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sectionIds } from "@/lib/data/nav";

const Ctx = createContext<string>(sectionIds[0]);

export const useActiveSection = (): string => useContext(Ctx);

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((x): x is HTMLElement => !!x);
    if (els.length === 0) return;

    const ratios = new Map<string, number>();
    sectionIds.forEach((id) => ratios.set(id, 0));

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let topId = sectionIds[0];
        let topRatio = -1;
        for (const id of sectionIds) {
          const r = ratios.get(id) ?? 0;
          if (r > topRatio) {
            topRatio = r;
            topId = id;
          }
        }
        setActive(topId);
      },
      {
        threshold: [0, 0.15, 0.35, 0.6, 0.85, 1],
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return <Ctx.Provider value={active}>{children}</Ctx.Provider>;
}
