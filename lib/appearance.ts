import { MOTION_STORAGE_KEY, THEME_STORAGE_KEY, themes } from "./themes";

export const APPEARANCE_STORAGE_KEY = "tam-portfolio-appearance";
export const appearances = ["light", "dark", "system"] as const;
export type Appearance = (typeof appearances)[number];
export type ResolvedAppearance = Exclude<Appearance, "system">;
export const isAppearance = (value: string | null | undefined): value is Appearance => appearances.some(item => item === value);

// Runs before the page paints, including when storage is unavailable.
export const appearanceInitScript = `(function(){var r=document.documentElement,t='editorial',a='system',m='on';try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes.map(item => item.id))}.includes(s))t=s;s=localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)});if(${JSON.stringify(appearances)}.includes(s))a=s;if(localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})==='off')m='off';}catch(e){}r.dataset.theme=t;r.dataset.appearancePreference=a;r.dataset.appearance=a==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):a;r.dataset.motion=m;})();`;

export const darkSwatches = {
  editorial: { ink: "#c7abe8", paper: "#19151e" },
  swiss: { ink: "#ff8978", paper: "#171716" },
  blueprint: { ink: "#8ab7ff", paper: "#0c1528" },
  play: { ink: "#c6a0ff", paper: "#1c122c" },
  botanical: { ink: "#abd0a1", paper: "#101d17" },
} as const;
