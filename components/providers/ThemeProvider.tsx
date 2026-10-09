"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { DESKTOP_THEME_CYCLE_MEDIA, isTheme, MOTION_STORAGE_KEY, THEME_STORAGE_KEY, themes, themeTransition, type ThemeId } from "@/lib/themes";
import { APPEARANCE_STORAGE_KEY, darkSwatches, isAppearance, type Appearance, type ResolvedAppearance } from "@/lib/appearance";
import { startThemeCircleReveal, themeClickOrigin, themeControlAtPoint, themeRevealCircle, type ThemeOrigin, type ThemeRevealHandle } from "@/lib/theme-reveal";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId, origin?: ThemeOrigin) => void;
  appearance: Appearance;
  resolvedAppearance: ResolvedAppearance;
  setAppearance: (appearance: Appearance) => void;
  motionPaused: boolean;
  toggleMotion: () => void;
  reduced: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const MotionContext = createContext<Pick<ThemeContextValue, "reduced"> | null>(null);
export const PortfolioThemeScope = ThemeContext.Provider;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, updateTheme] = useState<ThemeId>("editorial");
  const [appearance, updateAppearance] = useState<Appearance>("system");
  const [resolvedAppearance, updateResolvedAppearance] = useState<ResolvedAppearance>("light");
  const [motionPaused, setMotionPaused] = useState(false);
  const systemReduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const reduced = motionPaused || Boolean(systemReduced);
  const reveal = useRef<ThemeRevealHandle | null>(null);
  const revealVersion = useRef(0);
  const reducedPreference = useRef(reduced);
  const activation = useRef<{ origin: ThemeOrigin | undefined; at: number } | null>(null);
  reducedPreference.current = reduced;

  useEffect(() => {
    if (reduced) queueMicrotask(() => { if (reducedPreference.current) reveal.current?.skipTransition(); });
  }, [reduced]);

  useEffect(() => {
    const capture = (event: MouseEvent) => { activation.current = { origin: themeClickOrigin(event), at: performance.now() }; };
    document.addEventListener("click", capture, true);
    return () => {
      document.removeEventListener("click", capture, true);
      revealVersion.current++;
      reveal.current?.skipTransition();
      delete document.documentElement.dataset.themeReveal;
      delete document.documentElement.dataset.themeRevealPaint;
      document.documentElement.style.removeProperty("--theme-reveal-color");
    };
  }, []);

  const changeWithReveal = useCallback((commit: () => void, destination: { theme: ThemeId; appearance: ResolvedAppearance }, origin?: ThemeOrigin) => {
    const version = ++revealVersion.current;
    reveal.current?.skipTransition();
    const root = document.documentElement;
    delete root.dataset.themeRevealPaint;
    const apply = () => {
      if (version !== revealVersion.current) return;
      root.dataset.themeRevealPaint = "true";
      flushSync(commit);
    };
    const finish = () => {
      if (version !== revealVersion.current) return;
      reveal.current = null;
      delete root.dataset.themeReveal;
      delete root.dataset.themeRevealPaint;
      root.style.removeProperty("--theme-reveal-color");
    };
    if (reducedPreference.current || document.hidden) {
      delete root.dataset.themeReveal;
      apply();
      delete root.dataset.themeRevealPaint;
      root.style.removeProperty("--theme-reveal-color");
      reveal.current = null;
      return;
    }
    const recent = activation.current;
    const point = origin ?? (recent && performance.now() - recent.at < 300 ? recent.origin : undefined);
    const circle = themeRevealCircle(point, window.innerWidth, window.innerHeight);
    const target = themes.find(item => item.id === destination.theme)!;
    const palette = destination.appearance === "dark" ? darkSwatches[destination.theme] : { paper: target.paper, ink: target.color };
    root.dataset.themeReveal = "true";
    reveal.current = startThemeCircleReveal({ circle, accent: palette.ink, apply, isCurrent: () => version === revealVersion.current, onFinish: finish });
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    const resolved = next === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : next;
    const commit = () => {
      document.documentElement.dataset.appearancePreference = next;
      document.documentElement.dataset.appearance = resolved;
      updateAppearance(next);
      updateResolvedAppearance(resolved);
      try { localStorage.setItem(APPEARANCE_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
    };
    if (document.documentElement.dataset.appearance === resolved && !reveal.current) commit();
    else changeWithReveal(commit, { theme: isTheme(document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : "editorial", appearance: resolved });
  }, [changeWithReveal]);

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

  const setTheme = useCallback((next: ThemeId, origin?: ThemeOrigin) => {
    if (next === document.documentElement.dataset.theme && !reveal.current) return;
    changeWithReveal(() => {
      document.documentElement.dataset.theme = next;
      updateTheme(next);
      try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* The session still works when storage is unavailable. */ }
    }, { theme: next, appearance: document.documentElement.dataset.appearance === "dark" ? "dark" : "light" }, origin);
  }, [changeWithReveal]);

  useEffect(() => {
    const capturedChoice = (event: MouseEvent) => {
      if (!event.isTrusted || event.detail === 0 || event.target !== document.documentElement || document.documentElement.dataset.themeReveal !== "true") return;
      // Root snapshot capture retargets input to <html>. Recover only a real,
      // visible palette hit, preserving fast consecutive visitor selections.
      const origin = { x: event.clientX, y: event.clientY };
      const button = themeControlAtPoint(origin);
      const next = button?.dataset.themeOption;
      if (isTheme(next)) setTheme(next, origin);
      else if (isAppearance(button?.dataset.modeOption)) setAppearance(button.dataset.modeOption);
    };
    document.addEventListener("click", capturedChoice, true);
    return () => document.removeEventListener("click", capturedChoice, true);
  }, [setTheme, setAppearance]);

  useEffect(() => {
    let tap: { id: number; x: number; y: number; scrollX: number; scrollY: number; target: EventTarget | null } | null = null;
    const desktop = window.matchMedia(DESKTOP_THEME_CYCLE_MEDIA);
    const interactive = 'a,button,input,select,textarea,label,summary,iframe,video,audio,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="link"],[role="slider"],[role="switch"],[role="checkbox"],[role="radio"],[role="tab"],.appearance-dock,[data-theme-cycle-ignore]';
    const start = (event: PointerEvent) => {
      tap = null;
      // During snapshot capture browsers retarget pointer hit tests to <html>.
      // That synthetic background target must never cycle the theme again.
      if (document.documentElement.dataset.themeReveal === "true" && event.target === document.documentElement) return;
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
      setTheme(themes[(themes.findIndex(item => item.id === current) + 1) % themes.length].id, { x: event.clientX, y: event.clientY });
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
  const motionValue = useMemo(() => ({ reduced }), [reduced]);
  return <ThemeContext.Provider value={value}><MotionContext.Provider value={motionValue}><MotionConfig reducedMotion={reduced ? "always" : "user"} transition={themeTransition(theme, reduced)}>{children}</MotionConfig></MotionContext.Provider></ThemeContext.Provider>;
}

export function usePortfolioTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("usePortfolioTheme must be used inside ThemeProvider");
  return context;
}

/** Motion-only consumers do not subscribe to every theme and palette change. */
export function usePortfolioMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("usePortfolioMotion must be used inside ThemeProvider");
  return context;
}
