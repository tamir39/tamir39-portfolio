"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { PortfolioThemeScope, usePortfolioTheme } from "./providers/ThemeProvider";
import { themeTransition } from "@/lib/themes";

const ViewportContext = createContext(true);

/** Keep decorative subtrees mounted, but publish theme changes only in view. */
export function ViewportThemeScope({ target, children }: { target: string; children: React.ReactNode }) {
  const current = usePortfolioTheme();
  const [visible, setVisible] = useState(true);
  const shown = useRef(current);
  if (visible) shown.current = current;
  useLayoutEffect(() => {
    const element = document.querySelector(target);
    if (!element) return;
    const box = element.getBoundingClientRect();
    setVisible(box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);
  const { theme, appearance, resolvedAppearance } = shown.current;
  // Motion preferences and actions remain live even when theme artwork is parked.
  const { setTheme, setAppearance, motionPaused, toggleMotion, reduced } = current;
  const value = useMemo(() => ({ theme, appearance, resolvedAppearance, setTheme, setAppearance, motionPaused, toggleMotion, reduced }),
    [theme, appearance, resolvedAppearance, setTheme, setAppearance, motionPaused, toggleMotion, reduced]);
  const transition = useMemo(() => themeTransition(theme, reduced), [theme, reduced]);
  return <PortfolioThemeScope value={value}><ViewportContext.Provider value={visible}><MotionConfig
    reducedMotion={reduced ? "always" : "user"} transition={transition}
  >{children}</MotionConfig></ViewportContext.Provider></PortfolioThemeScope>;
}

export function useThemeViewportVisible() { return useContext(ViewportContext); }
