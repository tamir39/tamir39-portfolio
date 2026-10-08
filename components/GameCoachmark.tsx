"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MousePointer2, X } from "lucide-react";

type TargetBounds = { left: number; top: number; width: number; height: number };

export function GameCoachmark({ root, target, message, visible, onDismiss, preferSide = true }: {
  root: RefObject<HTMLDivElement | null>;
  target: string;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  preferSide?: boolean;
}) {
  const [bounds, setBounds] = useState<TargetBounds | null>(null);

  useEffect(() => {
    if (!visible) { setBounds(null); return; }
    const control = root.current?.querySelector<HTMLElement>(target);
    if (!control) return;
    let frame = 0;
    const measure = () => {
      const rect = control.getBoundingClientRect();
      const next = rect.width && rect.top >= 140 && rect.bottom <= window.innerHeight - 12
        ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        : null;
      setBounds(previous => previous?.left === next?.left && previous?.top === next?.top && previous?.width === next?.width && previous?.height === next?.height ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(control);
    if (root.current) resize.observe(root.current);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [root, target, visible]);

  if (!visible || !bounds) return null;
  const width = Math.min(216, window.innerWidth - 32);
  const side = preferSide && bounds.left + bounds.width + width + 32 <= window.innerWidth;
  const left = side ? bounds.left + bounds.width + 16 : Math.max(16, Math.min(window.innerWidth - width - 16, bounds.left + bounds.width / 2 - width / 2));
  return createPortal(<div className="game-coach-layer" data-theme-cycle-ignore>
    <div className="game-coach-target" aria-hidden="true" style={{ left: bounds.left - 4, top: bounds.top - 4, width: bounds.width + 8, height: bounds.height + 8 }}><MousePointer2 className="game-coach-pointer" size={23} /></div>
    <div className="game-coach-pop" data-placement={side ? "side" : "above"} role="note" aria-label="Game tip" style={{ left, top: side ? bounds.top + bounds.height / 2 : bounds.top - 14, width }} onKeyDown={event => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onDismiss();
      root.current?.querySelector<HTMLElement>(target)?.focus({ preventScroll: true });
    }}>
      <span className="game-coach-label">Start here</span>
      <p>{message}</p>
      <button type="button" onClick={event => { onDismiss(); if (event.detail === 0) root.current?.querySelector<HTMLElement>(target)?.focus({ preventScroll: true }); }} aria-label="Dismiss game tip"><X size={14} aria-hidden="true" /></button>
    </div>
  </div>, document.body);
}
