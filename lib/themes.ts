import type { Transition } from "framer-motion";

export const themes = [
  { id: "editorial", cursor: "Soft halo", name: "Editorial", number: "01", symbol: "Aa", color: "#75618d", paper: "#fbf8f5", title: ["Small details.", "Big feelings."], description: "Quiet luxury · serif accents · soft reveals", motion: "Soft reveals", transition: { type: "tween", duration: 0.38, ease: "easeOut" } },
  { id: "swiss", cursor: "Precision square", name: "Swiss", number: "02", symbol: "+", color: "#b52e21", paper: "#fafaf7", title: ["Clear thinking.", "Bold interfaces."], description: "Confident type · precise grids · crisp slides", motion: "Crisp slides", transition: { type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  { id: "blueprint", cursor: "Drafting crosshair", name: "Blueprint", number: "03", symbol: "⌘", color: "#1644b8", paper: "#f3f7ff", title: ["Every detail.", "By design."], description: "Cobalt lines · technical type · traced paths", motion: "Traced paths", transition: { type: "tween", duration: 0.3, ease: "easeInOut" } },
  { id: "play", cursor: "Star & color trail", name: "Play", number: "04", symbol: "✳", color: "#6331a7", paper: "#fff9e9", title: ["Good ideas.", "Great reactions."], description: "Bold shapes · tactile surfaces · playful tilts", motion: "Tactile springs", transition: { type: "spring", duration: 0.4, bounce: 0 } },
  { id: "botanical", cursor: "Leaf follower", name: "Botanical", number: "05", symbol: "❋", color: "#386046", paper: "#f6f5ed", title: ["Thoughtful roots.", "Better experiences."], description: "Earthy greens · organic forms · gentle unfolds", motion: "Gentle unfolds", transition: { type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
] as const;

export type ThemeId = (typeof themes)[number]["id"];
export const THEME_STORAGE_KEY = "tam-portfolio-theme";
export const MOTION_STORAGE_KEY = "tam-portfolio-motion";
export const DESKTOP_THEME_CYCLE_MEDIA = "(min-width: 900px) and (hover: hover) and (pointer: fine)";
export const isTheme = (value: string | null | undefined): value is ThemeId => themes.some(theme => theme.id === value);

export function themeTransition(theme: ThemeId, reduced: boolean): Transition {
  return reduced ? { duration: 0 } : { ...themes.find(item => item.id === theme)!.transition } as Transition;
}

export function themeEntrance(theme: ThemeId, reduced: boolean) {
  if (reduced) return { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };
  if (theme === "swiss") return { opacity: 0, x: -18, y: 0, scale: 1, rotate: 0 };
  if (theme === "play") return { opacity: 0, x: 0, y: 12, scale: 0.96, rotate: -2 };
  if (theme === "botanical") return { opacity: 0, x: 0, y: 20, scale: 0.98, rotate: 0 };
  return { opacity: 0, x: 0, y: 12, scale: 1, rotate: 0 };
}
