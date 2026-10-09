export type ThemeOrigin = { x: number; y: number };

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
