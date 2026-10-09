export type ThemeOrigin = { x: number; y: number };
export type ThemeRevealHandle = { skipTransition: () => void };
export const THEME_REVEAL_MS = 560;

/** Reveal the actual incoming viewport, preserving the original circle and rim. */
export function startThemeCircleReveal({ circle, accent, apply, isCurrent, onFinish }: {
  circle: { x: number; y: number; radius: number };
  accent: string;
  apply: () => void;
  isCurrent: () => boolean;
  onFinish: () => void;
}): ThemeRevealHandle | null {
  let committed = false, stopped = false;
  let transition: ViewTransition | undefined;
  const animations: Animation[] = [];
  const ring = document.createElement("div");
  const { x, y, radius } = circle;
  const root = document.documentElement;
  const commit = () => { if (!committed && isCurrent()) { committed = true; apply(); } };
  const finish = () => {
    if (stopped) return;
    stopped = true;
    animations.forEach(animation => animation.cancel());
    ring.remove();
    window.removeEventListener("resize", skip);
    document.removeEventListener("visibilitychange", visibility);
    onFinish();
  };
  const skip = () => { if (stopped) return; transition?.skipTransition(); commit(); finish(); };
  const visibility = () => { if (document.hidden) skip(); };
  if (typeof document.startViewTransition !== "function") { commit(); finish(); return null; }
  ring.className = "theme-reveal-ring";
  ring.setAttribute("aria-hidden", "true");
  Object.assign(ring.style, { left: `${x}px`, top: `${y}px` });
  root.style.setProperty("--theme-reveal-color", accent);
  document.body.append(ring);
  window.addEventListener("resize", skip, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  try {
    transition = document.startViewTransition(commit);
    void transition.ready.then(() => {
      if (stopped) return;
      if (!isCurrent()) { skip(); return; }
      try {
        animations.push(root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
          duration: THEME_REVEAL_MS, easing: "cubic-bezier(.2,.65,.3,1)", pseudoElement: "::view-transition-new(root)",
        }));
        animations.push(root.animate([
          { width: "0px", height: "0px", transform: `translate(${x}px, ${y}px)` },
          { width: `${radius * 2}px`, height: `${radius * 2}px`, transform: `translate(${x - radius}px, ${y - radius}px)` },
        ], { duration: THEME_REVEAL_MS, easing: "cubic-bezier(.2,.65,.3,1)", pseudoElement: "::view-transition-group(theme-reveal-rim)" }));
      } catch { skip(); }
    }, () => skip());
    void transition.finished.then(finish, () => skip());
  } catch { skip(); }
  return stopped ? null : { skipTransition: skip };
}

/** Cover every corner, including clicks at the very edge of the viewport. */
export function themeRevealCircle(origin: ThemeOrigin | undefined, width: number, height: number) {
  const x = Math.max(0, Math.min(width, Number.isFinite(origin?.x) ? origin!.x : width / 2));
  const y = Math.max(0, Math.min(height, Number.isFinite(origin?.y) ? origin!.y : height / 2));
  return { x, y, radius: Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y))) + 1 };
}

/** Keyboard activation reveals from the control, pointer activation from the cursor. */
export function themeClickOrigin(event: Pick<MouseEvent, "detail" | "clientX" | "clientY" | "target">): ThemeOrigin | undefined {
  if (event.detail > 0) return { x: event.clientX, y: event.clientY };
  const target = event.target instanceof Element ? event.target.closest("button,a,input,select,[role=button]") : null;
  const box = target?.getBoundingClientRect();
  return box ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : undefined;
}

/** The fixed palette keeps its geometry while a root snapshot suppresses hit testing. */
export function themeControlAtPoint(origin: ThemeOrigin): HTMLButtonElement | undefined {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.appearance-dock[data-open="true"] [data-theme-option],.appearance-dock[data-open="true"] [data-mode-option]')).find(button => {
    if (button.disabled || button.closest("[inert]")) return false;
    const box = button.getBoundingClientRect();
    return origin.x >= box.left && origin.x <= box.right && origin.y >= box.top && origin.y <= box.bottom;
  });
}
