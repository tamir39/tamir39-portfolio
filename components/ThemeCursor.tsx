"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Asterisk, Leaf } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import type { ThemeId } from "@/lib/themes";

const followSpeed: Record<ThemeId, number> = { editorial: .2, swiss: .65, blueprint: .4, play: .28, botanical: .14 };

/** A decorative follower: native pointers and all hit targets remain intact. */
export function ThemeCursor() {
  const { theme, reduced } = usePortfolioTheme();
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const speed = useRef(followSpeed[theme]);

  useEffect(() => { speed.current = followSpeed[theme]; }, [theme]);

  useEffect(() => {
    const element = cursor.current;
    if (!element || reduced) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trails = Array.from(element.querySelectorAll<HTMLElement>(".cursor-trail"));
    const positions = trails.map(() => ({ x: 0, y: 0 }));
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let frame = 0;
    let visible = false;
    let lastTime = 0;

    const hide = () => {
      visible = false;
      element.dataset.visible = "false";
      element.dataset.pressed = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const paint = (time: number) => {
      frame = 0;
      if (!visible) return;
      // Time-based easing feels the same on 60 Hz and high-refresh screens.
      const elapsed = lastTime ? Math.min(48, time - lastTime) : 16.67;
      lastTime = time;
      const ease = 1 - Math.pow(1 - speed.current, elapsed / 16.67);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      let distance = Math.abs(targetX - x) + Math.abs(targetY - y);
      positions.forEach((position, index) => {
        const ahead = index === 0 ? { x, y } : positions[index - 1];
        const trailEase = 1 - Math.pow(.72, elapsed / 16.67);
        position.x += (ahead.x - position.x) * trailEase;
        position.y += (ahead.y - position.y) * trailEase;
        trails[index].style.transform = `translate3d(${position.x - x}px, ${position.y - y}px, 0)`;
        distance += Math.abs(ahead.x - position.x) + Math.abs(ahead.y - position.y);
      });
      // No perpetual animation loop while the pointer is idle.
      if (distance > .2) frame = requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || systemReduced.matches || document.hidden) { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, select, [contenteditable="true"], iframe')) { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      element.dataset.interactive = String(Boolean(target?.closest('a, button, summary, [role="button"]')));
      if (!visible) {
        x = targetX; y = targetY; lastTime = 0;
        positions.forEach(position => { position.x = x; position.y = y; });
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        visible = true;
        element.dataset.visible = "true";
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const down = (event: PointerEvent) => { move(event); element.dataset.pressed = String(visible); };
    const up = () => { element.dataset.pressed = "false"; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    const preference = () => { if (!finePointer.matches || systemReduced.matches) hide(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", visibility);
    finePointer.addEventListener("change", preference);
    systemReduced.addEventListener("change", preference);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", visibility);
      finePointer.removeEventListener("change", preference);
      systemReduced.removeEventListener("change", preference);
    };
  }, [reduced, pathname]);

  return <div ref={cursor} className="theme-cursor" data-theme={theme} data-visible="false" data-reduced={reduced} aria-hidden="true">
    <span className="cursor-trail" /><span className="cursor-trail" /><span className="cursor-trail" />
    <span className="cursor-mark">{theme === "play" ? <Asterisk size={28} strokeWidth={1.8} /> : theme === "botanical" ? <Leaf size={28} strokeWidth={1.4} /> : null}</span>
  </div>;
}
