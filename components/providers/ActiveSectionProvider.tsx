"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sectionIds } from "@/lib/data/nav";

const Ctx = createContext<string>(sectionIds[0]);

export const useActiveSection = (): string => useContext(Ctx);

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>(sectionIds[0]);

  useEffect(() => {
    // Re-attach the observer on every route change. Sections only exist on
    // the home page; navigating to /missions/[slug] tears them down and
    // returning re-creates them. Without rebinding we would observe stale,
    // detached DOM nodes and the active indicator would never update again.
    let attempts = 0;
    let raf = 0;
    let obs: IntersectionObserver | null = null;

    const attach = () => {
      const els = sectionIds
        .map((id) => document.getElementById(id))
        .filter((x): x is HTMLElement => !!x);
      if (els.length === 0) {
        // Sections not in DOM yet (route just changed); retry up to ~10 frames.
        if (attempts++ < 10) {
          raf = requestAnimationFrame(attach);
        }
        return;
      }

      const ratios = new Map<string, number>();
      sectionIds.forEach((id) => ratios.set(id, 0));

      obs = new IntersectionObserver(
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

      els.forEach((el) => obs!.observe(el));
    };

    attach();

    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
    };
  }, [pathname]);

  // Sync URL hash with the active section while the user scrolls on /.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    const targetHash = active === sectionIds[0] ? "" : `#${active}`;
    const current = window.location.hash;
    if (current !== targetHash) {
      window.history.replaceState(null, "", `/${targetHash}`);
    }
  }, [active]);

  return <Ctx.Provider value={active}>{children}</Ctx.Provider>;
}
