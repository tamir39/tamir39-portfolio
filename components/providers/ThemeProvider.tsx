"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { DESKTOP_THEME_CYCLE_MEDIA, isTheme, MOTION_STORAGE_KEY, THEME_STORAGE_KEY, themes, themeTransition, type ThemeId } from "@/lib/themes";
import { APPEARANCE_STORAGE_KEY, isAppearance, type Appearance, type ResolvedAppearance } from "@/lib/appearance";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  appearance: Appearance;
  resolvedAppearance: ResolvedAppearance;
  setAppearance: (appearance: Appearance) => void;
  motionPaused: boolean;
  toggleMotion: () => void;
  reduced: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, updateTheme] = useState<ThemeId>("editorial");
  const [appearance, updateAppearance] = useState<Appearance>("system");
  const [resolvedAppearance, updateResolvedAppearance] = useState<ResolvedAppearance>("light");
  const [motionPaused, setMotionPaused] = useState(false);
  const systemReduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const reduced = motionPaused || Boolean(systemReduced);

  const setAppearance = useCallback((next: Appearance) => {
    const resolved = next === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : next;
    document.documentElement.dataset.appearancePreference = next;
    document.documentElement.dataset.appearance = resolved;
    updateAppearance(next);
    updateResolvedAppearance(resolved);
    try { localStorage.setItem(APPEARANCE_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
  }, []);

  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    if (isTheme(initial)) updateTheme(initial);
    const preference = document.documentElement.dataset.appearancePreference;
    if (isAppearance(preference)) updateAppearance(preference);
    updateResolvedAppearance(document.documentElement.dataset.appearance === "dark" ? "dark" : "light");
    setMotionPaused(document.documentElement.dataset.motion === "off");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (document.documentElement.dataset.appearancePreference !== "system") return;
      const resolved = media.matches ? "dark" : "light";
      document.documentElement.dataset.appearance = resolved;
      updateResolvedAppearance(resolved);
    };
    // Keep multiple open portfolio tabs consistent without reading storage in render.
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        const next = isTheme(event.newValue) ? event.newValue : "editorial";
        document.documentElement.dataset.theme = next;
        updateTheme(next);
      }
      if (event.key === APPEARANCE_STORAGE_KEY || event.key === null) {
        const next = isAppearance(event.newValue) ? event.newValue : "system";
        const resolved = next === "system" ? (media.matches ? "dark" : "light") : next;
        document.documentElement.dataset.appearancePreference = next;
        document.documentElement.dataset.appearance = resolved;
        updateAppearance(next);
        updateResolvedAppearance(resolved);
      }
      if (event.key === MOTION_STORAGE_KEY || event.key === null) {
        const paused = event.newValue === "off";
        document.documentElement.dataset.motion = paused ? "off" : "on";
        setMotionPaused(paused);
      }
    };
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onSystemChange);
    return () => { window.removeEventListener("storage", onStorage); media.removeEventListener("change", onSystemChange); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", getComputedStyle(root).getPropertyValue("--color-paper").trim());
    const style = isTheme(root.dataset.theme) ? root.dataset.theme : theme;
    const mode = root.dataset.appearance === "dark" ? "dark" : "light";
    const syncIcons = () => document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach(icon => {
      const href = `/brand/favicons/${style}-${mode}.png?v=circle-1`;
      if (icon.getAttribute("href") !== href) icon.setAttribute("href", href);
      icon.type = "image/png";
      icon.sizes.value = "64x64";
    });
    syncIcons();
    // Next can insert metadata links after hydration or a route transition.
    const icons = new MutationObserver(syncIcons);
    icons.observe(document.head, { childList: true });
    return () => icons.disconnect();
  }, [theme, resolvedAppearance, pathname]);

  const setTheme = useCallback((next: ThemeId) => {
    document.documentElement.dataset.theme = next;
    updateTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* The session still works when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    let tap: { id: number; x: number; y: number; scrollX: number; scrollY: number; target: EventTarget | null } | null = null;
    const desktop = window.matchMedia(DESKTOP_THEME_CYCLE_MEDIA);
    const interactive = 'a,button,input,select,textarea,label,summary,iframe,video,audio,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="link"],[role="slider"],[role="switch"],[role="checkbox"],[role="radio"],[role="tab"],.appearance-dock,[data-theme-cycle-ignore]';
    const start = (event: PointerEvent) => {
      tap = null;
      if (!desktop.matches || event.pointerType === "touch") return;
      if (!event.isPrimary || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || !(event.target instanceof Element) || event.target.closest(interactive)) return;
      tap = { id: event.pointerId, x: event.clientX, y: event.clientY, scrollX: window.scrollX, scrollY: window.scrollY, target: event.target };
    };
    const move = (event: PointerEvent) => {
      if (tap?.id === event.pointerId && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 8) tap = null;
    };
    const cancel = () => { tap = null; };
    const finish = (event: PointerEvent) => {
      const started = tap;
      tap = null;
      if (!desktop.matches) return;
      if (!started || started.id !== event.pointerId || started.target !== event.target || event.defaultPrevented || Math.hypot(event.clientX - started.x, event.clientY - started.y) > 8 || Math.abs(window.scrollX - started.scrollX) > 2 || Math.abs(window.scrollY - started.scrollY) > 2 || window.getSelection()?.isCollapsed === false) return;
      const current = document.documentElement.dataset.theme;
      setTheme(themes[(themes.findIndex(item => item.id === current) + 1) % themes.length].id);
    };
    window.addEventListener("pointerdown", start, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", finish, { passive: true });
    window.addEventListener("pointercancel", cancel, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [setTheme]);

  const toggleMotion = useCallback(() => {
    const paused = !motionPaused;
    document.documentElement.dataset.motion = paused ? "off" : "on";
    setMotionPaused(paused);
    try { localStorage.setItem(MOTION_STORAGE_KEY, paused ? "off" : "on"); } catch { /* Optional persistence. */ }
  }, [motionPaused]);

  const value = useMemo(() => ({ theme, setTheme, appearance, resolvedAppearance, setAppearance, motionPaused, toggleMotion, reduced }), [theme, setTheme, appearance, resolvedAppearance, setAppearance, motionPaused, toggleMotion, reduced]);
  return <ThemeContext.Provider value={value}><MotionConfig reducedMotion={reduced ? "always" : "user"} transition={themeTransition(theme, reduced)}>{children}</MotionConfig></ThemeContext.Provider>;
}

export function usePortfolioTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("usePortfolioTheme must be used inside ThemeProvider");
  return context;
}
