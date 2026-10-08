import type { ResolvedAppearance } from "./appearance";
import type { ThemeId } from "./themes";

export const CAT_AI_SIGNALS = ["section", "project", "discovery", "appearance-change", "help", "pet"] as const;
export const CAT_AI_SECTIONS = ["intro", "playground", "work", "about", "contact"] as const;

export type CatCommentRequest = {
  signal: (typeof CAT_AI_SIGNALS)[number];
  section: (typeof CAT_AI_SECTIONS)[number];
  appearance: ResolvedAppearance;
  theme: ThemeId;
};

export type CatCommentResponse = { text: string };
export type CatAiReadiness = { enabled: boolean };

const themeIds = ["editorial", "swiss", "blueprint", "play", "botanical"] as const;
const requestKeys = ["signal", "section", "appearance", "theme"];

export function parseCatCommentRequest(value: unknown): CatCommentRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (Object.keys(data).length !== requestKeys.length || Object.keys(data).some(key => !requestKeys.includes(key))) return null;
  if (!CAT_AI_SIGNALS.some(signal => signal === data.signal)
    || !CAT_AI_SECTIONS.some(section => section === data.section)
    || (data.appearance !== "light" && data.appearance !== "dark")
    || !themeIds.some(theme => theme === data.theme)) return null;
  return data as CatCommentRequest;
}

export function parseCatCommentText(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (Object.keys(data).length !== 1 || typeof data.text !== "string") return null;
  // The client renders this as text, but reject markup and links at the boundary too.
  if (/[<>`\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(data.text)
    || /https?:\/\/|www\.|\[[^\]]*\]\(/iu.test(data.text)) return null;
  const text = data.text.replace(/\s+/gu, " ").trim();
  return text && Array.from(text).length <= 140 ? text : null;
}
