import type { ThemeId } from "./themes";
import type { ResolvedAppearance } from "./appearance";

export const CAT_THEME_TOUR_EVENT = "portfolio:theme-tour";
export type CatTourPhase = "inviting" | "moving" | "tapping" | "showing" | "guiding";
export type CatTourStep = { theme: ThemeId; mode?: ResolvedAppearance; name: string; text: string; index: number; total: number };
export type CatTourDockState = { active: boolean; theme?: ThemeId; mode?: ResolvedAppearance; tapping?: boolean; keepOpen?: boolean };
export type CatPickerChoice = { theme?: string; mode?: string };

const comments: Record<ThemeId, string> = {
  editorial: "Editorial. A little elegance. I have excellent taste.",
  swiss: "Swiss. Bold and direct. Like a cat asking for dinner.",
  blueprint: "Blueprint. Everything has a plan. Even my mischief.",
  play: "Play. Permission to be a little ridiculous. Finally.",
  botanical: "Botanical. A breath of fresh air. Please keep the plants.",
};

const heroComments: Record<ThemeId, string> = {
  editorial: "Gentle paw. Big feelings.",
  swiss: "Bold paw. Clear thinking.",
  blueprint: "A paw with a precise plan.",
  play: "Good ideas. Tiny mischief.",
  botanical: "Thoughtful roots. Let’s grow.",
};

/** The starting look is already visible; four touches complete the five-look lap. */
export function catThemeTourPlan(choices: readonly { id: ThemeId; name: string }[], original: ThemeId): CatTourStep[] {
  const start = Math.max(0, choices.findIndex(choice => choice.id === original));
  return choices.slice(1).map((_, index) => {
    const choice = choices[(start + index + 1) % choices.length];
    return { theme: choice.id, name: choice.name, text: heroComments[choice.id], index, total: choices.length - 1 };
  });
}

export const CAT_HERO_TRAVEL_MS = 480;
export const CAT_HERO_ANTICIPATION_MS = 400;
export const CAT_HERO_TOUCH_MS = 140;
export const CAT_HERO_READ_MS = 650;
export const CAT_PICKER_GUIDE_MS = 3000;
type HeroBox = { x: number; y: number; width: number; height: number };
export type CatHeroArc = { left: number; right: number; baseline: number; rise: number };

/** One upper half-ellipse, sampled continuously rather than joining straight hops. */
export function catHeroArcPoint(arc: CatHeroArc, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return { x: arc.left + (arc.right - arc.left) * (1 - Math.cos(Math.PI * t)) / 2,
    y: arc.baseline - arc.rise * Math.sin(Math.PI * t) };
}

/** Four contacts progress across the first text line from left to right. */
export function catHeroStop(lines: readonly HeroBox[], index: number, catWidth: number, petHeight: number) {
  const line = lines[0];
  if (!line) return null;
  const inset = Math.min(14, line.width / 4);
  const contact = { x: line.x + inset + (line.width - inset * 2) * Math.max(0, Math.min(1, index / 3)), y: line.y + line.height * .35 };
  const top = Math.min(...lines.map(box => box.y));
  return { contact, perch: { x: contact.x - catWidth / 2, y: top - petHeight - 20 } };
}

/** A single playful experiment uses the same real controls and sequence as the tour. */
export function catThemePlayPlan(choices: readonly { id: ThemeId; name: string }[], current: ThemeId, appearance: ResolvedAppearance, random = Math.random): CatTourStep[] {
  const draw = () => { const value = random(); return Number.isFinite(value) ? Math.max(0, Math.min(.999999, value)) : 0; };
  if (draw() >= .65) {
    const mode = appearance === "dark" ? "light" : "dark";
    return [{ theme: current, mode, name: `${mode === "light" ? "Light" : "Dark"} mode`, index: 0, total: 1,
      text: mode === "light" ? "Let there be light. I found the switch with my paw." : "Mood lighting. I am now a very mysterious cat." }];
  }
  const alternatives = choices.filter(choice => choice.id !== current);
  const choice = alternatives[Math.floor(draw() * alternatives.length)];
  if (!choice) return [];
  return [{ theme: choice.id, name: choice.name, text: comments[choice.id], index: 0, total: 1 }];
}

export function catThemePlayOverridden(step: CatTourStep, choice: CatPickerChoice): boolean {
  return step.mode ? choice.mode !== step.mode : choice.theme !== step.theme;
}

/** Count engaged viewing, hold a ready action until free, and back off after takeover. */
export class CatThemePlayCycle {
  private remaining: number;
  constructor(private readonly random: () => number = Math.random) { this.remaining = this.delay(35_000, 55_000); }
  advance(elapsed: number, engaged: boolean, available: boolean): boolean {
    if (!engaged || !Number.isFinite(elapsed) || elapsed <= 0 || elapsed > 5000) return false;
    this.remaining = Math.max(0, this.remaining - elapsed);
    if (this.remaining > 0 || !available) return false;
    this.remaining = this.delay(90_000, 150_000);
    return true;
  }
  defer(): void { this.remaining = Math.max(this.remaining, 120_000); }
  private delay(min: number, max: number): number {
    const value = this.random();
    return min + (max - min) * (Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0);
  }
}

type TourPorts = {
  signal: AbortSignal;
  wait: (milliseconds: number) => Promise<void>;
  visit: (step: CatTourStep) => Promise<void>;
  tap: (step: CatTourStep) => void;
  show: (step: CatTourStep) => void;
};

/** One sequential owner: cancellation cannot leave a late tap or queued comment. */
export async function runCatThemeTour(plan: readonly CatTourStep[], ports: TourPorts): Promise<void> {
  const check = () => ports.signal.throwIfAborted();
  check();
  await ports.wait(900);
  for (const step of plan) {
    check();
    await ports.visit(step);
    check();
    ports.tap(step);
    await ports.wait(260);
    check();
    ports.show(step);
    await ports.wait(2400);
  }
  check();
}

/** Say it, touch it, then let the heading finish typing before the next journey. */
export async function runCatHeroTour(plan: readonly CatTourStep[], ports: TourPorts & { speak: (step: CatTourStep) => void; change: (step: CatTourStep) => void; reveal: (step: CatTourStep) => Promise<void>; guide: () => Promise<void> }): Promise<void> {
  const check = () => ports.signal.throwIfAborted();
  check();
  for (const step of plan) {
    await ports.visit(step);
    check();
    ports.speak(step);
    await ports.wait(CAT_HERO_ANTICIPATION_MS);
    check();
    ports.tap(step);
    await ports.wait(CAT_HERO_TOUCH_MS);
    check();
    ports.change(step);
    await ports.reveal(step);
    check();
    ports.show(step);
    await ports.wait(CAT_HERO_READ_MS);
    check();
  }
  await ports.guide();
  check();
}
