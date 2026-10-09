export const MOBILE_THEME_COVER_MS = 240;
export const MOBILE_THEME_FADE_MS = 90;
export const LIGHTWEIGHT_THEME_REVEAL_MEDIA = "(max-width: 899px), (pointer: coarse)";

export type ThemeRevealHandle = { skipTransition: () => void };

type CoverOptions = {
  circle: { x: number; y: number; radius: number };
  paper: string;
  accent: string;
  apply: () => void;
  isCurrent: () => boolean;
  onFinish: () => void;
};

/** Cover the old view with one shape; no page captures or per-frame layout. */
export function startThemeCoverReveal({ circle, paper, accent, apply, isCurrent, onFinish }: CoverOptions): ThemeRevealHandle | null {
  const layer = document.createElement("div");
  layer.className = "theme-reveal-cover";
  layer.setAttribute("aria-hidden", "true");
  const disc = document.createElement("div");
  disc.className = "theme-reveal-disc";
  const { x, y, radius } = circle;
  Object.assign(disc.style, { left: `${x - radius}px`, top: `${y - radius}px`, width: `${radius * 2}px`, height: `${radius * 2}px`, color: accent });
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${radius * 2} ${radius * 2}`);
  const rim = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  for (const [name, value] of Object.entries({ cx: radius, cy: radius, r: radius, fill: paper, stroke: "currentColor", "stroke-width": 3, "vector-effect": "non-scaling-stroke" })) rim.setAttribute(name, String(value));
  svg.append(rim); disc.append(svg); layer.append(disc);
  document.body.append(layer);

  let stopped = false, committed = false, frame = 0;
  let growth: Animation | undefined, fade: Animation | undefined;
  const commit = () => { if (!committed && isCurrent()) { committed = true; apply(); } };
  const finish = (applyChoice = false) => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    growth?.cancel();
    fade?.cancel();
    window.removeEventListener("resize", skip);
    document.removeEventListener("visibilitychange", visibility);
    if (applyChoice) commit();
    layer.remove();
    onFinish();
  };
  const skip = () => finish(true);
  const visibility = () => { if (document.hidden) skip(); };
  window.addEventListener("resize", skip, { passive: true });
  document.addEventListener("visibilitychange", visibility);

  try {
    growth = disc.animate({ transform: [`scale(${Math.min(1, 8 / radius)})`, "scale(1)"] }, {
      duration: MOBILE_THEME_COVER_MS, easing: "cubic-bezier(.2,.65,.3,1)", fill: "forwards",
    });
    void growth.finished.then(() => {
      if (stopped) return;
      if (!isCurrent()) { finish(); return; }
      commit();
      // Give the new page one paint under the opaque cover before fading it.
      frame = requestAnimationFrame(() => {
        if (stopped) return;
        if (!isCurrent()) { finish(); return; }
        try {
          fade = layer.animate({ opacity: [1, 0] }, { duration: MOBILE_THEME_FADE_MS, easing: "ease-out", fill: "forwards" });
          void fade.finished.then(() => finish(), () => finish(true));
        } catch { finish(true); }
      });
    }, () => finish(true));
  } catch { finish(true); }
  return stopped ? null : { skipTransition: skip };
}
