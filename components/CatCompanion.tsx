"use client";

import { memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { usePathname } from "next/navigation";
import { Ellipsis, Pause, Play, X } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { CAT_REACTIONS, CatBehaviorController, type CatContext, type CatEmotion, type CatInteraction, type CatReaction, type CatSignal } from "@/lib/cat-behavior";
import { catInMobileCenter, CAT_MOBILE_CENTER_VISIT_MS, chooseCatMobileEdgeReturn, chooseCatPageArea, chooseCatPerch, chooseCatNuzzle, chooseCatDrop, chooseCatRestFacing, type CatObstacle, type CatPoint } from "@/lib/cat-presence";
import { CatActivityCycle, CAT_ACTIVITY_DURATIONS, type CatActivity } from "@/lib/cat-activities";
import { useCatThemeTour } from "@/lib/hooks/useCatThemeTour";
import { CatThemePlayCycle, catHeroStop, catHeroArcPoint, CAT_HERO_TRAVEL_MS, type CatTourStep, type CatHeroArc } from "@/lib/cat-theme-tour";

const STORAGE = "tamir-cat-preferences-v1";
const QUIET_AFTER = 24_000;
const SLEEP_AFTER = 55_000;
const AI_SIGNALS = new Set<CatSignal>(["section", "project", "discovery", "appearance-change", "help", "pet"]);
const ANNOUNCE_SIGNALS = new Set<CatSignal>(["pet", "drag", "help", "discovery", "theme-override", "tour-stop", "form-success", "form-error"]);
const FORM_SIGNALS = new Set<CatSignal>(["form-focus", "form-success", "form-error"]);
const WRITING_SELECTOR = 'textarea,input:not([type]),input[type="text"],input[type="email"],input[type="search"],input[type="url"],input[type="tel"],input[type="password"],[contenteditable="true"]';
const faces: Record<CatEmotion, { glyph: string; eye: string }> = {
  welcome: { glyph: "✧", eye: "open" }, happy: { glyph: "♡", eye: "smile" },
  curious: { glyph: "?", eye: "open" }, confused: { glyph: "?!", eye: "wide" },
  helpful: { glyph: "↙", eye: "open" }, excited: { glyph: "✦", eye: "smile" },
  sleepy: { glyph: "z Z", eye: "closed" }, suspicious: { glyph: "…", eye: "narrow" },
  shy: { glyph: "♡", eye: "smile" }, thinking: { glyph: "···", eye: "narrow" },
  oops: { glyph: "!", eye: "wide" },
};
const sectionMap: Record<string, string> = { intro: "intro", lab: "intro", exploration: "playground", work: "work", games: "work", "game-development": "work", independent: "work", academic: "work", focus: "work", about: "about", approach: "about", contact: "contact" };
const activityEmotions: Record<CatActivity, CatEmotion> = { groom: "happy", eat: "happy", scratch: "thinking", cloth: "curious", stretch: "welcome", yawn: "welcome", sniff: "curious", wave: "happy" };
const emotionIcons: Record<CatEmotion, string> = { welcome: "😺", happy: "🐾", curious: "🔎", confused: "❔", helpful: "💡", excited: "✨", sleepy: "💤", suspicious: "👀", shy: "💕", thinking: "💭", oops: "🙀" };

function catControl(target: Element): { element: Element; kind: CatInteraction | "project" } | null {
  const element = target.closest('a,button,summary,select,input[type="range"],input[type="radio"],input[type="checkbox"],[role="tab"],[role="radio"],[role="checkbox"]');
  // A menu can detach before the document click listener receives the same event.
  if (!element || element.closest('.cat-companion,.companion-controls,.companion-speech,.companion-tools,.companion-pet,.companion-return,.contact-form,[aria-hidden="true"]')) return null;
  if (element.closest('.appearance-dock') || element.matches('.hero-theme-hint')) return { element, kind: "appearance" };
  if (element.tagName === "SUMMARY") return { element, kind: "reference" };
  if (element.matches('select,input,[role="tab"],[role="radio"],[role="checkbox"]')) return { element, kind: "choice" };
  if (element.tagName === "A") {
    const href = element.getAttribute("href") ?? "";
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;
    if (href.startsWith("#") || href.startsWith("/#")) return { element, kind: "navigate" };
    if (href.includes("youtube.com/") || href.includes("youtu.be/")) return { element, kind: "media" };
    if (href.startsWith("/missions/") || element.closest('article:has(a[href^="/missions/"])')) return { element, kind: "project" };
    return { element, kind: "link" };
  }
  if (element.closest('#exploration,.notebook-live-preview')) return { element, kind: "play" };
  return { element, kind: "button" };
}

function visibleObstacles(node: HTMLElement): CatObstacle[] {
  const width = window.innerWidth, height = window.innerHeight;
  const obstacles: CatObstacle[] = [];
  const add = (box: DOMRect) => {
    if (box.width && box.height && box.bottom > 80 && box.top < height && box.right > 0 && box.left < width) obstacles.push({ x: box.x, y: box.y, width: box.width, height: box.height });
  };
  document.querySelectorAll<HTMLElement>('a,button,input,textarea,select,summary,img,iframe,video,.appearance-fan,.game-coach-pop,.notebook-live-preview').forEach(element => {
    // The transparent hero canvas is a background interaction, not foreground ink.
    if (!node.contains(element) && !element.matches('.hero-artwork-surface') && !element.closest('[inert]')) add(element.getBoundingClientRect());
  });
  // Text line boxes leave actual whitespace available instead of treating a whole row as ink.
  document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,dt,dd,label').forEach(element => {
    if (node.contains(element) || element.closest('[inert]')) return;
    const box = element.getBoundingClientRect();
    if (box.bottom <= 80 || box.top >= height || !box.width) return;
    if (element.matches("h1.hero-title")) { heroLines(element).forEach(add); return; }
    const range = document.createRange(); range.selectNodeContents(element);
    Array.from(range.getClientRects()).forEach(add);
  });
  return obstacles;
}

function heroLines(heading: Element): DOMRect[] {
  return Array.from(heading.querySelectorAll(":scope > [data-hero-line]")).map(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    return range.getBoundingClientRect();
  }).filter(box => box.width && box.height);
}

function heroReservation(theme?: string): { box: CatObstacle; shift: number } | null {
  const heading = document.querySelector<HTMLElement>("h1.hero-title");
  if (!heading) return null;
  const box = heading.getBoundingClientRect();
  const sample = heading.querySelector<HTMLElement>(`.hero-title-sample[data-hero-theme="${theme ?? heading.dataset.heroTheme}"]`);
  const height = sample?.getBoundingClientRect().height ?? box.height;
  const centered = window.innerWidth >= 1024 || heading.closest('[data-hero-stage="showcase"]');
  const nextTop = centered ? box.y + (box.height - height) / 2 : box.y;
  const top = Math.min(box.y, nextTop) - 16, bottom = Math.max(box.bottom, nextTop + height) + 16;
  return { box: { x: box.x, y: top, width: box.width, height: bottom - top }, shift: centered ? 0 : height - box.height };
}

function heroStop(index: number, catWidth: number, petHeight: number) {
  const heading = document.querySelector<HTMLElement>("h1.hero-title");
  if (!heading) throw new Error("Hero heading unavailable");
  const lines = heroLines(heading);
  const stop = catHeroStop(lines, index, catWidth, petHeight);
  if (!stop || stop.contact.y < 80 || stop.contact.y > window.innerHeight - 12) throw new Error("Hero heading outside the viewport");
  return stop;
}

function heroArcForCat(node: HTMLElement, petHeight: number): CatHeroArc | null {
  const heading = document.querySelector<HTMLElement>("h1.hero-title");
  if (!heading) return null;
  const box = heading.getBoundingClientRect();
  const maxHeight = Math.max(box.height, ...Array.from(heading.querySelectorAll(".hero-title-sample")).map(sample => sample.getBoundingClientRect().height));
  const top = window.innerWidth >= 1024 || heading.closest('[data-hero-stage="showcase"]') ? box.y + (box.height - maxHeight) / 2 : box.y;
  const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
  const index = document.querySelector(".hero-index")?.getBoundingClientRect().bottom ?? header;
  const upper = Math.max(header + 12, index + 12);
  const baseline = Math.max(header + 12, top - petHeight - 26);
  const left = Math.max(12, box.x - node.offsetWidth / 2 + 12);
  const right = Math.min(window.innerWidth - node.offsetWidth - 12, box.right - node.offsetWidth / 2 - 12);
  return { left, right: Math.max(left, right), baseline,
    rise: Math.max(0, Math.min(72, (right - left) * .17, baseline - upper)) };
}

const CatSpeechText = memo(function CatSpeechText({ text, icon, reduced, quick = false }: { text: string; icon: string; reduced: boolean; quick?: boolean }) {
  const letters = useMemo(() => Array.from(text), [text]);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const duration = quick ? Math.min(360, Math.max(180, letters.length * 10)) : Math.min(1200, Math.max(320, letters.length * 17));
    let frame = 0;
    const started = performance.now();
    const reveal = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      setRevealed(Math.floor(progress * letters.length));
      if (progress < 1) frame = requestAnimationFrame(reveal);
    };
    frame = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frame);
  }, [letters, reduced, quick]);

  return <p className="companion-text">
    <span className="companion-text-measure" aria-hidden="true"><span className="companion-sentence-icon">{icon}</span>{text}</span>
    <span className="companion-text-reveal" aria-hidden="true"><span className="companion-sentence-icon">{icon}</span>{reduced ? text : letters.slice(0, revealed).join("")}</span>
    <span className="sr-only">{text}</span>
  </p>;
});

function CatActivityProp({ activity }: { activity: CatActivity }) {
  return <svg className="companion-activity-prop" viewBox="0 0 96 122" aria-hidden="true" focusable="false">
    {activity === "eat" ? <g className="companion-bowl">
      <ellipse cx="23" cy="106" rx="20" ry="5" fill="var(--theme-note)" />
      <g className="companion-kibble" fill="var(--color-ink)"><circle cx="14" cy="104" r="2" /><circle cx="22" cy="102" r="2.5" /><circle cx="31" cy="104" r="2" /></g>
      <path d="M3 106Q23 113 43 106L37 119H9Z" fill="currentColor" />
      <path d="M10 113H35" stroke="var(--color-paper)" strokeWidth="1.5" opacity=".5" />
    </g> : null}
    {activity === "scratch" ? <g className="companion-scratch-paper">
      <path d="M4 96H35L45 106V120H4Z" fill="var(--theme-note)" stroke="var(--theme-line)" />
      <path d="M35 96V106H45" fill="none" stroke="var(--theme-line)" />
      <g className="companion-scratch-marks" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M15 101L20 116" /><path d="M21 100L26 115" /><path d="M27 101L32 116" /></g>
    </g> : null}
    {activity === "cloth" ? <g className="companion-cloth">
      <path d="M7 104Q18 94 29 101L56 98Q48 112 63 118L34 121Q21 111 7 117Z" fill="currentColor" opacity=".72" />
      <path d="M15 104Q26 112 36 107M25 102Q34 111 42 116M40 103L47 115" fill="none" stroke="var(--color-paper)" strokeWidth="1.4" opacity=".65" />
    </g> : null}
    {activity === "sniff" ? <g className="companion-scent" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 80Q-2 75 2 70" /><path d="M9 77Q5 71 9 66" /></g> : null}
    {activity === "groom" || activity === "scratch" || activity === "cloth" || activity === "wave" ? <g className="companion-activity-paw" fill="currentColor">
      <path d="M39 111Q16 116 15 100Q11 88 20 84Q27 81 31 91L39 111Z" />
      <path d="M19 89L22 95M24 88L27 94" fill="none" stroke="var(--color-paper)" strokeWidth="1.1" opacity=".7" />
    </g> : null}
  </svg>;
}

function CatFace({ emotion, maskId, activity }: { emotion: CatEmotion; maskId: string; activity: CatActivity | null }) {
  return <div className="companion-facing"><div className="companion-pose" data-eye={activity === "yawn" ? "closed" : faces[emotion].eye}>
    <svg viewBox="260 160 740 940" aria-hidden="true" focusable="false">
      <defs><mask id={maskId} style={{ maskType: "alpha" }}><image width="1280" height="1280" href="/brand/cat-monochrome.png" /></mask></defs>
      <rect width="1280" height="1280" fill="currentColor" mask={`url(#${maskId})`} />
      {/* Cover the entire native eye so animated expressions leave no cheek sliver. */}
      <ellipse cx="545" cy="638" rx="122" ry="83" fill="currentColor" />
      <g className="companion-eye"><path className="companion-cut" d="M460 670 Q510 590 620 600 Q575 687 460 670Z" /><ellipse className="companion-pupil" cx="546" cy="636" rx="10" ry="29" /></g>
      <path className="companion-smile companion-cut-line" d="M478 650 Q525 607 584 624" />
      <path className="companion-sleep companion-cut-line" d="M478 637 Q532 661 584 624" />
      <path className="companion-brow companion-cut-line" d="M508 574 Q545 552 580 562" />
      <path className="companion-mouth companion-cut-line" d="M357 801 Q382 825 412 802" />
      {activity === "yawn" ? <g className="companion-yawn"><ellipse cx="383" cy="807" rx="32" ry="42" fill="currentColor" /><ellipse className="companion-cut" cx="383" cy="807" rx="18" ry="32" /><ellipse cx="383" cy="824" rx="12" ry="9" fill="var(--color-coral)" /></g> : null}
      {activity === "groom" ? <path className="companion-tongue" d="M365 806Q340 851 370 855Q391 850 382 817Z" fill="var(--color-coral)" /> : null}
    </svg>
  </div>{activity ? <CatActivityProp activity={activity} /> : null}</div>;
}

export function CatCompanion() {
  const maskId = useId().replaceAll(":", "");
  const controlsId = useId();
  const dragInstructionsId = useId();
  const pathname = usePathname();
  const { theme, setTheme, resolvedAppearance, reduced } = usePortfolioTheme();
  const [mounted, setMounted] = useState(false);
  const [reaction, setReaction] = useState<CatReaction | null>(null);
  const [aiComment, setAiComment] = useState<{ id: string; text: string } | null>(null);
  const [restMode, setRestMode] = useState<"active" | "napping" | "paused">("active");
  const paused = restMode === "paused";
  const napping = restMode === "napping";
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [touchPulse, setTouchPulse] = useState(0);
  const [tourTouch, setTourTouch] = useState<(CatPoint & { serial: number }) | null>(null);
  const touchSerial = useRef(0);
  const heroArc = useRef<CatHeroArc | null>(null);
  const heroProgress = useRef(-1);
  const heroFrame = useRef(0);
  const heroContact = useRef<CatPoint | null>(null);
  const initiallyPlaced = useRef(false);
  const [activity, setActivity] = useState<CatActivity | null>(null);
  const [dragging, setDragging] = useState(false);
  const [landing, setLanding] = useState(false);
  const drag = useRef<{ id: number; startX: number; startY: number; origin: CatPoint; moved: boolean; lastX: number; facingX: number } | null>(null);
  const landingTimer = useRef(0);
  const suppressClickUntil = useRef(0);
  const activityCycle = useRef(new CatActivityCycle());
  const currentActivity = useRef<CatActivity | null>(null);
  const requestedActivity = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const pet = useRef<HTMLButtonElement>(null);
  const controls = useRef<HTMLButtonElement>(null);
  const controller = useRef<CatBehaviorController | null>(null);
  const activeReaction = useRef<CatReaction | null>(null);
  const context = useRef<CatContext>({ section: "intro", location: "intro", theme, appearance: resolvedAppearance });
  const preferences = useRef({ paused, napping, hidden, reduced, typing, menuOpen, dragging });
  const position = useRef({ x: 0, y: 0, variation: 0 });
  const presence = useRef({ lastActivity: 0, lastScroll: 0, idleStage: 0, sectionSince: 0, announcedLocation: "intro", lastRoam: 0, lastMove: 0, manualUntil: 0 });
  const formTypingAnnounced = useRef(false);
  const travelUntil = useRef(0);
  const facingTimer = useRef(0);
  const departureTimer = useRef(0);
  const inputModality = useRef<"pointer" | "keyboard">("pointer");
  const ai = useRef({ enabled: false, attempts: 0, lastRequest: 0, abort: null as AbortController | null });
  const themePlayCycle = useRef(new CatThemePlayCycle());
  const previousAppearance = useRef(resolvedAppearance);
  const previousTheme = useRef(theme);
  const ready = useRef(false);
  const tourBusy = useRef(false);
  const pointer = useRef<(CatPoint & { at: number; safe: boolean }) | null>(null);
  const lastCuddle = useRef(0);
  const nearSince = useRef(0);
  const bubbleEngagement = useRef({ pointer: false, focus: false });
  const interacting = useRef({ pointer: false, focus: false });
  context.current = { ...context.current, theme, appearance: resolvedAppearance };
  preferences.current = { paused, napping, hidden, reduced, typing, menuOpen, dragging };

  const signal = useCallback((next: CatSignal, count?: number, interaction?: CatInteraction) => {
    if (tourBusy.current || document.documentElement.dataset.pageIntro !== "complete") return false;
    if (preferences.current.dragging && next !== "drag") return false;
    if (preferences.current.napping && next !== "drag") return false;
    if (!preferences.current.dragging && preferences.current.typing && !FORM_SIGNALS.has(next)) return false;
    if (next === "control-hover" && activeReaction.current) return false;
    if ((next === "theme-change" || next === "appearance-change") && activeReaction.current?.signal === "theme-override") return false;
    if (next === "control-use" && activeReaction.current && activeReaction.current.priority >= CAT_REACTIONS[next].priority) return false;
    return controller.current?.signal(next, { ...context.current, count, interaction }) ?? false;
  }, []);
  const stopActivity = useCallback(() => {
    requestedActivity.current = false;
    activityCycle.current.reset(performance.now());
    if (currentActivity.current) { currentActivity.current = null; setActivity(null); }
  }, []);
  const changeRestMode = useCallback((mode: "active" | "napping" | "paused") => {
    preferences.current.paused = mode === "paused";
    preferences.current.napping = mode === "napping";
    presence.current.lastActivity = performance.now();
    presence.current.idleStage = 0;
    stopActivity();
    controller.current?.dismiss();
    ai.current.abort?.abort();
    setRestMode(mode);
  }, [stopActivity]);

  const fitBubble = useCallback(() => {
    const node = root.current, bubble = node?.querySelector<HTMLElement>(".companion-speech,.companion-controls");
    if (!node || !bubble) return;
    const { x, y } = position.current, bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    if (node.dataset.tourKind === "tour" && node.dataset.tourTheme && bubble.matches(".companion-tour-speech")) {
      const reserve = heroReservation(node.dataset.tourTheme);
      const point = chooseCatDrop({ x: x + node.offsetWidth + 24, y: y - 12 }, window.innerWidth, window.innerHeight, bw, bh, [
        ...visibleObstacles(node), ...(reserve ? [reserve.box] : []),
        { x, y, width: node.offsetWidth, height: pet.current?.offsetHeight ?? 97 },
        { x: 0, y: 0, width: window.innerWidth, height: document.querySelector("header")?.getBoundingClientRect().bottom ?? 80 },
      ]);
      node.style.setProperty("--companion-bubble-x", `${point.x - x}px`);
      node.style.setProperty("--companion-bubble-y", `${point.y - y}px`);
      return;
    }
    const desiredX = tourBusy.current && window.innerWidth >= 900 ? node.offsetWidth + 32 : node.dataset.side === "right" ? node.offsetWidth - bw : 0;
    const offsetX = Math.max(12 - x, Math.min(window.innerWidth - 12 - bw - x, desiredX));
    const desiredY = tourBusy.current ? window.innerWidth >= 900 ? -12 : -bh - 40 : -bh - 12;
    const offsetY = Math.max(12 - y, Math.min(window.innerHeight - 12 - bh - y, desiredY));
    node.style.setProperty("--companion-bubble-x", `${offsetX}px`);
    node.style.setProperty("--companion-bubble-y", `${offsetY}px`);
  }, []);

  const settleFacing = useCallback(() => {
    const node = root.current;
    if (!node || tourBusy.current || window.innerWidth >= 600 || preferences.current.dragging || performance.now() < travelUntil.current) return;
    node.dataset.facing = chooseCatRestFacing(node.getBoundingClientRect().x, window.innerWidth, node.offsetWidth, node.dataset.facing === "right" ? "right" : "left");
    node.style.setProperty("--companion-look-x", "0px");
    node.style.setProperty("--companion-look-y", "0px");
  }, []);

  useEffect(() => { if (mounted) settleFacing(); }, [mounted, restMode, settleFacing]);

  const faceForTravel = useCallback((node: HTMLElement, point: CatPoint, duration: number) => {
    const from = node.getBoundingClientRect(), dx = point.x - from.x, dy = point.y - from.y;
    if (Math.abs(dx) >= 2) node.dataset.facing = dx > 0 ? "right" : "left";
    const travelDuration = Math.hypot(dx, dy) >= 2 && !preferences.current.reduced && !preferences.current.paused && node.dataset.resizing !== "true" ? duration : 0;
    travelUntil.current = performance.now() + travelDuration;
    window.clearTimeout(facingTimer.current);
    facingTimer.current = window.setTimeout(settleFacing, travelDuration + 32);
    if (Math.hypot(dx, dy) >= 2) {
      node.style.setProperty("--companion-look-x", "-6px");
      node.style.setProperty("--companion-look-y", `${Math.max(-10, Math.min(10, dy / 20))}px`);
    }
  }, [settleFacing]);

  const relocate = useCallback((roam = false) => {
    const node = root.current;
    if (!node || tourBusy.current || preferences.current.hidden || preferences.current.dragging) return;
    if (!initiallyPlaced.current) {
      initiallyPlaced.current = true;
      const heading = document.querySelector("h1.hero-title")?.getBoundingClientRect();
      const arc = heading && heading.top >= 80 && heading.bottom <= window.innerHeight - 12 ? heroArcForCat(node, pet.current?.offsetHeight ?? 97) : null;
      if (arc && !preferences.current.paused && !preferences.current.napping && !preferences.current.reduced) {
        const point = catHeroArcPoint(arc, 0);
        node.style.setProperty("--companion-travel-duration", "0ms");
        node.style.setProperty("--companion-x", `${point.x}px`);
        node.style.setProperty("--companion-y", `${point.y}px`);
        node.dataset.side = "left"; node.dataset.facing = "right";
        position.current = { ...point, variation: 0 };
        requestAnimationFrame(() => node.style.removeProperty("--companion-travel-duration"));
        return;
      }
    } else if (!ready.current) return;
    const width = window.innerWidth, height = window.innerHeight;
    const obstacles = visibleObstacles(node);
    if (roam) position.current.variation++;
    const side = position.current.variation % 3 === 2 && width >= 900 ? "left" : "right";
    const from = node.getBoundingClientRect();
    const point = chooseCatPerch(width, height, node.offsetWidth, node.offsetHeight, obstacles, side, position.current.variation, Math.random, roam ? { x: from.x, y: from.y } : undefined);
    node.dataset.side = point.x > width / 2 ? "right" : "left";
    faceForTravel(node, point, 1800);
    node.style.setProperty("--companion-x", `${point.x}px`);
    node.style.setProperty("--companion-y", `${point.y}px`);
    position.current = { ...point, variation: position.current.variation };
    presence.current.lastMove = performance.now();
    fitBubble();
  }, [fitBubble, faceForTravel]);

  const keepClear = useCallback((avoidContent = true) => {
    const node = root.current;
    if (!node || tourBusy.current || preferences.current.hidden || preferences.current.dragging) return;
    const point = chooseCatDrop(position.current, window.innerWidth, window.innerHeight, node.offsetWidth, node.offsetHeight, avoidContent ? visibleObstacles(node) : []);
    if (Math.hypot(point.x - position.current.x, point.y - position.current.y) > .5) {
      faceForTravel(node, point, 1800);
      node.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
      node.style.setProperty("--companion-x", `${point.x}px`);
      node.style.setProperty("--companion-y", `${point.y}px`);
      position.current = { ...point, variation: position.current.variation };
      presence.current.lastMove = performance.now();
    }
    settleFacing();
    fitBubble();
  }, [faceForTravel, fitBubble, settleFacing]);

  const clearTourPerch = useCallback(() => {
    const node = root.current;
    if (!node) return;
    const point = chooseCatDrop(position.current, window.innerWidth, window.innerHeight, node.offsetWidth, (pet.current?.offsetHeight ?? 97) + 10, visibleObstacles(node));
    if (Math.hypot(point.x - position.current.x, point.y - position.current.y) > .5) {
      faceForTravel(node, point, 1800);
      node.style.setProperty("--companion-x", `${point.x}px`);
      node.style.setProperty("--companion-y", `${point.y}px`);
      position.current = { ...point, variation: position.current.variation };
      presence.current.lastMove = performance.now();
    }
    fitBubble();
  }, [faceForTravel, fitBubble]);

  const onTourActive = useCallback((active: boolean, outcome?: { kind: "tour" | "play"; interrupted: boolean; visitor: boolean }) => {
    window.clearTimeout(departureTimer.current);
    cancelAnimationFrame(heroFrame.current);
    heroArc.current = null; heroProgress.current = -1; heroContact.current = null;
    setTourTouch(null);
    tourBusy.current = active;
    if (active) root.current?.style.setProperty("--companion-travel-duration", "1000ms");
    else root.current?.style.removeProperty("--companion-travel-duration");
    stopActivity();
    ai.current.abort?.abort();
    const prefs = preferences.current;
    controller.current?.suspend(active || document.hidden || prefs.hidden || prefs.paused || prefs.napping || prefs.menuOpen);
    if (!active) {
      const now = performance.now();
      presence.current.lastActivity = now; presence.current.lastRoam = now; presence.current.idleStage = 0;
      const node = root.current;
      if (outcome?.interrupted && node) {
        // Freeze at the rendered point, not the unfinished journey's destination.
        const box = node.getBoundingClientRect();
        node.style.setProperty("--companion-travel-duration", "0ms");
        node.style.setProperty("--companion-x", `${box.x}px`);
        node.style.setProperty("--companion-y", `${box.y}px`);
        position.current = { x: box.x, y: box.y, variation: position.current.variation };
        node.getBoundingClientRect();
        requestAnimationFrame(() => node.style.removeProperty("--companion-travel-duration"));
        travelUntil.current = 0; window.clearTimeout(facingTimer.current);
      }
      if (outcome?.kind === "tour") {
        presence.current.manualUntil = now + 4000;
        if (outcome.interrupted) {
          if (outcome.visitor && !prefs.typing && !prefs.menuOpen && !prefs.dragging && !prefs.hidden && !prefs.paused && !prefs.napping && !prefs.reduced && !document.hidden && signal("tour-stop")) {
            departureTimer.current = window.setTimeout(() => {
              const next = preferences.current;
              if (!tourBusy.current && !next.hidden && !next.paused && !next.napping && !next.typing && !next.menuOpen && !next.dragging && !next.reduced && !document.hidden && (!activeReaction.current || activeReaction.current.priority <= 28)) relocate(true);
            }, 3250);
          }
        } else {
          // Let the heading settle and the profile return before choosing clear space.
          departureTimer.current = window.setTimeout(() => {
            const next = preferences.current;
            if (!tourBusy.current && !next.hidden && !next.paused && !next.napping && !next.typing && !next.menuOpen && !next.dragging && !next.reduced && !document.hidden) relocate(true);
          }, 400);
        }
      }
      fitBubble();
    }
  }, [fitBubble, relocate, signal, stopActivity]);
  const onTourMove = useCallback((button: HTMLButtonElement, duration = 1000) => {
    const node = root.current;
    if (!node) return;
    cancelAnimationFrame(heroFrame.current);
    const box = button.getBoundingClientRect();
    const petHeight = pet.current?.offsetHeight ?? 97;
    const guiding = button.matches(".appearance-dock-trigger");
    const tray = (guiding ? document.querySelector(".appearance-fan") : button.closest(".appearance-fan"))?.getBoundingClientRect();
    const trayTop = tray?.top ?? box.top;
    const requested = {
      x: Math.max(12, Math.min(window.innerWidth - node.offsetWidth - 12, guiding && window.innerWidth < 900 && tray ? tray.right + 12 : box.x + box.width / 2 - node.offsetWidth / 2 + 8)),
      y: Math.max(80, Math.min(window.innerHeight - node.offsetHeight - 12, Math.min(box.top, trayTop + 10) - petHeight - 24)),
    };
    if (guiding && window.innerWidth < 900 && tray) requested.y = tray.top;
    const obstacles = [...visibleObstacles(node), { x: 0, y: 0, width: window.innerWidth, height: 80 }];
    // Reserve the tray before opening it, without blocking its transparent container.
    if (guiding && tray) {
      obstacles.push({ x: tray.x, y: tray.y, width: tray.width, height: tray.height });
      document.querySelectorAll<HTMLElement>('.appearance-fan button').forEach(control => { const rect = control.getBoundingClientRect(); obstacles.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }); });
    }
    const point = chooseCatDrop(requested, window.innerWidth, window.innerHeight, node.offsetWidth, petHeight + 10, obstacles);
    node.style.setProperty("--companion-travel-duration", `${duration}ms`);
    node.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
    faceForTravel(node, point, duration);
    node.style.setProperty("--companion-x", `${point.x}px`);
    node.style.setProperty("--companion-y", `${point.y}px`);
    position.current = { ...point, variation: position.current.variation };
    presence.current.lastMove = performance.now();
    fitBubble();
  }, [faceForTravel, fitBubble]);
  const popTouch = useCallback((target: CatPoint) => {
    const node = root.current;
    if (!node) return;
    const from = node.getBoundingClientRect();
    setTourTouch({ ...target, serial: ++touchSerial.current });
    node.dataset.facing = target.x < from.x + node.offsetWidth / 2 ? "left" : "right";
    node.style.setProperty("--companion-look-x", "0px");
    node.style.setProperty("--companion-look-y", "0px");
    travelUntil.current = 0;
    window.clearTimeout(facingTimer.current);
  }, []);
  const onTourTap = useCallback((button: HTMLButtonElement) => {
    const box = button.getBoundingClientRect();
    popTouch({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
  }, [popTouch]);
  const onHeroMove = useCallback((step: CatTourStep) => {
    const node = root.current;
    if (!node) return;
    const arc = heroArc.current ?? heroArcForCat(node, pet.current?.offsetHeight ?? 97);
    if (!arc) return;
    heroArc.current = arc;
    cancelAnimationFrame(heroFrame.current);
    const to = step.index / Math.max(1, step.total - 1), from = heroProgress.current;
    const origin = node.getBoundingClientRect(), point = catHeroArcPoint(arc, to);
    node.style.setProperty("--companion-travel-duration", "0ms");
    node.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
    faceForTravel(node, point, CAT_HERO_TRAVEL_MS);
    const started = performance.now();
    const move = (now: number) => {
      const progress = Math.min(1, (now - started) / CAT_HERO_TRAVEL_MS);
      const eased = progress * progress * (3 - 2 * progress);
      const next = from < 0 ? { x: origin.x + (point.x - origin.x) * eased, y: origin.y + (point.y - origin.y) * eased - Math.min(32, Math.abs(point.x - origin.x) * .1) * Math.sin(Math.PI * eased) } : catHeroArcPoint(arc, from + (to - from) * eased);
      node.style.setProperty("--companion-x", `${next.x}px`);
      node.style.setProperty("--companion-y", `${next.y}px`);
      position.current = { ...next, variation: position.current.variation };
      if (progress < 1) heroFrame.current = requestAnimationFrame(move);
      else heroProgress.current = to;
    };
    heroFrame.current = requestAnimationFrame(move);
    presence.current.lastMove = performance.now();
  }, [faceForTravel]);
  const onHeroTap = useCallback((step: CatTourStep) => {
    const node = root.current;
    if (!node) return;
    const { contact } = heroStop(step.index, node.offsetWidth, pet.current?.offsetHeight ?? 97);
    heroContact.current = contact;
    popTouch(contact);
  }, [popTouch]);
  const onHeroChange = useCallback((step: CatTourStep) => { setTheme(step.theme, heroContact.current ?? undefined); }, [setTheme]);
  const onThemeOverride = useCallback(() => { themePlayCycle.current.defer(); signal("theme-override"); }, [signal]);
  const tour = useCatThemeTour({ prepared: mounted, enabled: mounted && pathname === "/" && !paused && !napping && !hidden && !reduced && !typing && !menuOpen && !dragging, onActive: onTourActive, onMove: onTourMove, onTap: onTourTap, onHeroMove, onHeroTap, onHeroChange, onOverride: onThemeOverride });
  const playWithPicker = useRef(tour.play);
  playWithPicker.current = tour.play;
  const tourLayout = useRef({ theme, appearance: resolvedAppearance });

  // Picker play can clear incoming content. Hero taps reserve both layouts up
  // front and keep the same perch through the wipe and heading reveal.
  useLayoutEffect(() => {
    const changed = tourLayout.current.theme !== theme || tourLayout.current.appearance !== resolvedAppearance;
    tourLayout.current = { theme, appearance: resolvedAppearance };
    const step = tour.state?.step;
    if (!changed || !tour.active.current || !step || tour.state?.phase === "moving") return;
    if (tour.state?.kind === "tour") return;
    const button = document.querySelector<HTMLButtonElement>(`.appearance-dock [data-${step.mode ? `mode-option="${step.mode}"` : `theme-option="${step.theme}"`}]`);
    if (button) clearTourPerch();
  }, [theme, resolvedAppearance, tour.state, tour.active, clearTourPerch]);

  useLayoutEffect(() => { fitBubble(); }, [reaction, aiComment, menuOpen, mounted, tour.state, fitBubble]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE) || "{}");
      const savedRest = saved.napping === true ? "napping" : saved.paused === true ? "paused" : "active";
      setRestMode(savedRest); setHidden(saved.hidden === true);
      preferences.current.paused = savedRest === "paused"; preferences.current.napping = savedRest === "napping"; preferences.current.hidden = saved.hidden === true;
    } catch { /* The companion also works without storage. */ }
    setMounted(true);
    const now = performance.now();
    presence.current.lastActivity = now; presence.current.sectionSince = now; presence.current.lastRoam = now;
    const behavior = new CatBehaviorController(next => {
      stopActivity();
      activeReaction.current = next;
      bubbleEngagement.current = { pointer: false, focus: false };
      ai.current.abort?.abort();
      setAiComment(null); setReaction(next);
    });
    controller.current = behavior;
    ready.current = false;
    const welcome = window.setTimeout(() => { ready.current = true; signal("welcome"); }, 1600);
    const readiness = new AbortController();
    fetch("/api/cat-comment", { signal: readiness.signal }).then(response => response.ok ? response.json() : null).then(result => { ai.current.enabled = result?.enabled === true; }).catch(() => {});
    return () => { window.clearTimeout(welcome); window.clearTimeout(landingTimer.current); window.clearTimeout(facingTimer.current); window.clearTimeout(departureTimer.current); cancelAnimationFrame(heroFrame.current); behavior.destroy(); controller.current = null; readiness.abort(); ai.current.abort?.abort(); };
  }, [signal, stopActivity]);

  useEffect(() => {
    if (!mounted) return;
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ paused, napping, hidden })); } catch { /* Optional preference. */ }
    controller.current?.suspend(tourBusy.current || hidden || document.hidden || (!dragging && (paused || napping || menuOpen)));
    if (paused || napping || hidden || reduced || typing || menuOpen || dragging) stopActivity();
  }, [mounted, paused, napping, hidden, reduced, typing, menuOpen, dragging, stopActivity]);

  useLayoutEffect(() => { if (mounted && !hidden) relocate(); }, [mounted, hidden, relocate]);

  useEffect(() => {
    if (previousTheme.current !== theme) { previousTheme.current = theme; if (ready.current) signal("theme-change"); }
    if (previousAppearance.current !== resolvedAppearance) { previousAppearance.current = resolvedAppearance; if (ready.current) signal("appearance-change"); }
  }, [theme, resolvedAppearance, signal]);

  useEffect(() => {
    if (!mounted) return;
    context.current.section = pathname === "/" ? "intro" : "work";
    context.current.location = pathname === "/" ? "intro" : pathname;
    presence.current.sectionSince = performance.now();
    if (pathname !== "/") signal("project");
    const areas = Array.from(document.querySelectorAll('.hero-layout,.studio-heading,#exploration .notebook-chapter,main > section:not(#lab),#contact')).map(element => ({
      element,
      id: element.classList.contains("hero-layout") ? "intro" : element.id || element.getAttribute("aria-labelledby")?.replace(/-heading$/, "") || element.closest("section[id]")?.id || "intro",
    }));
    let sectionFrame = 0;
    const measure = () => {
      const location = chooseCatPageArea(areas.map(area => { const rect = area.element.getBoundingClientRect(); return { id: area.id, top: rect.top, bottom: rect.bottom }; }), window.innerHeight);
      if (!location) return;
      const section = sectionMap[location] || (location.startsWith("studio-") ? "playground" : "work");
      if (context.current.location !== location) {
        context.current = { ...context.current, section, location };
        presence.current.sectionSince = performance.now();
        if (activeReaction.current?.signal === "section") controller.current?.dismiss();
        if (location !== "contact") formTypingAnnounced.current = false;
      }
    };
    const schedule = () => { if (!sectionFrame) sectionFrame = requestAnimationFrame(() => { sectionFrame = 0; measure(); }); };
    const observer = new IntersectionObserver(schedule, { rootMargin: "-90px 0px -20% 0px", threshold: 0 });
    areas.forEach(area => observer.observe(area.element));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    relocate();
    return () => { observer.disconnect(); cancelAnimationFrame(sectionFrame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [mounted, pathname, relocate, signal]);

  useEffect(() => {
    if (!mounted) return;
    let frame = 0, hoverTimer = 0, settleTimer = 0, scrollSample = { time: performance.now(), y: window.scrollY }, hiddenSince = 0;
    let viewportWidth = window.innerWidth;
    let hoveredControl: Element | null = null;
    const activity = () => {
      const wasSleeping = presence.current.idleStage === 2;
      presence.current.lastActivity = performance.now(); presence.current.idleStage = 0;
      if (wasSleeping) signal("return");
      else if (activeReaction.current?.signal === "idle") controller.current?.dismiss();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      activity();
      const target = event.target as Element;
      pointer.current = { x: event.clientX, y: event.clientY, at: performance.now(), safe: !target.closest('a,button,input,textarea,select,summary,iframe,[contenteditable="true"],.cat-companion,.appearance-dock') };
      if (frame || tourBusy.current || preferences.current.paused || preferences.current.napping || preferences.current.reduced || preferences.current.hidden || preferences.current.dragging) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = root.current;
        if (!node || tourBusy.current || preferences.current.dragging) return;
        const box = node.getBoundingClientRect();
        const dx = event.clientX - box.left - box.width / 2, dy = event.clientY - box.top - box.height / 2;
        if (Math.hypot(dx, dy) < 110 && performance.now() >= travelUntil.current) {
          if (!nearSince.current) nearSince.current = performance.now();
          if (performance.now() - nearSince.current > 600 && signal("cuddle")) lastCuddle.current = performance.now();
        } else nearSince.current = 0;
        if (performance.now() < travelUntil.current) return;
        if (Math.abs(dx) > 70) node.dataset.facing = dx > 0 ? "right" : "left";
        const direction = node.dataset.facing === "right" ? -1 : 1;
        node.style.setProperty("--companion-look-x", `${Math.max(-16, Math.min(16, dx / 12)) * direction}px`);
        node.style.setProperty("--companion-look-y", `${Math.max(-10, Math.min(10, dy / 14))}px`);
      });
    };
    const scroll = () => {
      activity();
      const now = performance.now(), delta = now - scrollSample.time;
      if (delta > 100) {
        if (Math.abs(window.scrollY - scrollSample.y) / delta > 2.5) signal("scroll-fast");
        scrollSample = { time: now, y: window.scrollY };
      }
      presence.current.lastScroll = now;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => { const prefs = preferences.current; if (performance.now() > presence.current.manualUntil && !prefs.paused && !prefs.napping && !prefs.reduced && !prefs.typing && !prefs.menuOpen && !prefs.dragging && !interacting.current.pointer && !interacting.current.focus) keepClear(); }, window.innerWidth < 600 ? 1400 : 900);
    };
    const focus = (event: FocusEvent) => {
      activity();
      const element = event.target as HTMLElement | null;
      const isTyping = Boolean(element?.closest(WRITING_SELECTOR));
      if (isTyping && !preferences.current.typing) {
        controller.current?.dismiss(); ai.current.abort?.abort(); keepClear();
      }
      preferences.current.typing = isTyping;
      setTyping(isTyping);
    };
    const input = (event: Event) => {
      const element = event.target as HTMLElement | null;
      if (formTypingAnnounced.current || !element?.closest('.contact-form') || !element.matches('input:not([name="_gotcha"]),textarea')) return;
      activity();
      if (signal("form-focus")) formTypingAnnounced.current = true;
    };
    const blur = () => {
      requestAnimationFrame(() => setTyping(Boolean(document.activeElement?.closest(WRITING_SELECTOR))));
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target as Element;
      const control = catControl(target);
      const card = target.closest('article:has(a[href^="/missions/"])');
      const element = control?.element ?? card;
      if (!element || element === hoveredControl || element.contains(event.relatedTarget as Node | null)) return;
      window.clearTimeout(hoverTimer);
      hoveredControl = element;
      hoverTimer = window.setTimeout(() => {
        if (!element.isConnected || !element.matches(":hover")) return;
        if (control?.kind === "project" || !control) signal("project");
        else signal("control-hover", undefined, control.kind);
      }, 1600);
    };
    const out = (event: PointerEvent) => {
      if (hoveredControl && !hoveredControl.contains(event.relatedTarget as Node | null)) { window.clearTimeout(hoverTimer); hoveredControl = null; }
    };
    const click = (event: MouseEvent) => {
      activity();
      window.clearTimeout(hoverTimer);
      const element = event.target as Element;
      if (preferences.current.menuOpen && !element.closest(".cat-companion")) setMenuOpen(false);
      if (root.current?.dataset.cuddling === "true" && !element.closest(".cat-companion")) { root.current.dataset.cuddling = "false"; relocate(); }
      const control = catControl(element);
      if (!control) return;
      if (control.kind === "project") signal("project");
      else if (control.kind !== "navigate" && control.kind !== "appearance" && !control.element.matches('input[type="range"],select')) signal("control-use", undefined, control.kind);
    };
    const change = (event: Event) => {
      const control = catControl(event.target as Element);
      if (control?.kind === "choice") signal("control-use", undefined, "choice");
    };
    const onSignal = (event: Event) => {
      const detail = (event as CustomEvent<{ signal: CatSignal; count?: number }>).detail;
      if (detail && ["discovery", "form-success", "form-error"].includes(detail.signal)) signal(detail.signal, detail.count);
    };
    const visibility = () => {
      if (document.hidden) {
        hiddenSince = performance.now(); stopActivity(); controller.current?.suspend(true); ai.current.abort?.abort();
        const captured = drag.current; drag.current = null; preferences.current.dragging = false; setDragging(false);
        if (captured && pet.current?.hasPointerCapture(captured.id)) pet.current.releasePointerCapture(captured.id);
      }
      else {
        const prefs = preferences.current;
        controller.current?.suspend(prefs.hidden || (!prefs.dragging && (prefs.paused || prefs.napping || prefs.menuOpen)));
        if (hiddenSince && performance.now() - hiddenSince > 15000) signal("return");
        activity();
      }
    };
    const escape = (event: KeyboardEvent) => {
      inputModality.current = "keyboard";
      if (root.current?.contains(document.activeElement)) interacting.current.focus = true;
      activity();
      if (event.key !== "Escape") return;
      if (preferences.current.menuOpen) { setMenuOpen(false); controls.current?.focus(); }
      else if (activeReaction.current) { controller.current?.dismiss(); if (root.current?.contains(document.activeElement)) pet.current?.focus(); }
    };
    let previousTick = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now(), elapsed = now - previousTick; previousTick = now;
      const prefs = preferences.current;
      const currentNode = root.current;
      if (!currentNode?.matches(":hover")) interacting.current.pointer = false;
      if (!currentNode?.contains(document.activeElement)) interacting.current.focus = false;
      if (tourBusy.current || document.documentElement.dataset.pageIntro !== "complete" || document.hidden || prefs.paused || prefs.napping || prefs.hidden || prefs.typing || prefs.menuOpen || prefs.dragging) { stopActivity(); return; }
      const quiet = now - presence.current.lastActivity;
      const engaged = quiet < SLEEP_AFTER;
      if (!prefs.reduced && !requestedActivity.current && !interacting.current.pointer && !interacting.current.focus && !bubbleEngagement.current.pointer && !bubbleEngagement.current.focus && currentNode && now > presence.current.manualUntil && now - presence.current.lastScroll > 1200 && now - presence.current.lastMove >= CAT_MOBILE_CENTER_VISIT_MS && catInMobileCenter(position.current.x, window.innerWidth, currentNode.offsetWidth) && document.documentElement.dataset.themeReveal !== "true") {
        const point = chooseCatMobileEdgeReturn(position.current, window.innerWidth, window.innerHeight, currentNode.offsetWidth, currentNode.offsetHeight, now - presence.current.lastMove, visibleObstacles(currentNode));
        if (point) {
          stopActivity();
          currentNode.dataset.cuddling = "false";
          currentNode.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
          faceForTravel(currentNode, point, 1800);
          currentNode.style.setProperty("--companion-x", `${point.x}px`);
          currentNode.style.setProperty("--companion-y", `${point.y}px`);
          position.current = { ...point, variation: position.current.variation };
          presence.current.lastMove = now; presence.current.lastRoam = now;
          fitBubble();
          return;
        }
      }
      const canPlay = pathname === "/" && quiet > 3000 && !prefs.reduced && !currentActivity.current && !activeReaction.current && !interacting.current.pointer && !interacting.current.focus && now > presence.current.manualUntil && now - presence.current.lastScroll > 3000 && now - presence.current.lastMove > 2200 && !document.querySelector('.appearance-dock[data-open="true"]');
      if (themePlayCycle.current.advance(elapsed, pathname === "/" && engaged && !prefs.reduced, canPlay)) { playWithPicker.current(); return; }
      const manualActivity = requestedActivity.current && Boolean(currentActivity.current);
      const nextActivity = activityCycle.current.advance(now, (ready.current || manualActivity) && !prefs.reduced && !activeReaction.current && (manualActivity || (!interacting.current.pointer && !interacting.current.focus && now - presence.current.lastScroll > 2000 && now - presence.current.lastMove > 2200)));
      if (!nextActivity) requestedActivity.current = false;
      if (nextActivity !== currentActivity.current) { currentActivity.current = nextActivity; setActivity(nextActivity); }
      if (!prefs.reduced) {
        if (quiet >= SLEEP_AFTER && presence.current.idleStage < 2) { if (signal("sleep")) presence.current.idleStage = 2; }
        else if (quiet >= QUIET_AFTER && presence.current.idleStage < 1) { if (signal("idle")) presence.current.idleStage = 1; }
        const cursor = pointer.current, node = root.current;
        if (cursor?.safe && node && now > presence.current.manualUntil && !currentActivity.current && !interacting.current.pointer && !interacting.current.focus && quiet > 2000 && quiet < 12000 && now - lastCuddle.current > 45000 && !activeReaction.current && Math.random() < .3) {
          const point = chooseCatNuzzle(cursor, window.innerWidth, window.innerHeight, node.offsetWidth, node.offsetHeight, visibleObstacles(node));
          if (point && signal("cuddle")) {
            node.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
            faceForTravel(node, point, 1800);
            node.dataset.cuddling = "true";
            node.style.setProperty("--companion-x", `${point.x}px`); node.style.setProperty("--companion-y", `${point.y}px`);
            position.current = { ...point, variation: position.current.variation }; lastCuddle.current = now;
            presence.current.lastMove = now;
            fitBubble();
          }
        }
        if (engaged && !currentActivity.current && !interacting.current.pointer && !interacting.current.focus && !activeReaction.current && now > presence.current.manualUntil && now - presence.current.lastRoam > 10000 && now - presence.current.lastScroll > 1200 && now - presence.current.lastMove > 2200) { if (node) node.dataset.cuddling = "false"; relocate(true); presence.current.lastRoam = now + Math.random() * 4000; }
      }
      const location = context.current.location ?? context.current.section;
      if (ready.current && location !== presence.current.announcedLocation && now - presence.current.sectionSince > 900 && now - presence.current.lastScroll > 500) {
        presence.current.announcedLocation = location;
        signal("section");
      }
    }, 1000);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    const resize = () => {
      const node = root.current;
      if (!node) return;
      const layoutChanged = Math.abs(window.innerWidth - viewportWidth) > 2;
      viewportWidth = window.innerWidth;
      // Mobile browser chrome and the keyboard change height during scrolling.
      // Keep the same perch; only a real width change requires layout clearance.
      if (layoutChanged) node.dataset.resizing = "true";
      keepClear(layoutChanged);
      if (layoutChanged) requestAnimationFrame(() => { if (root.current) delete root.current.dataset.resizing; });
    };
    window.addEventListener("resize", resize);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);
    document.addEventListener("input", input);
    document.addEventListener("change", change);
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("click", click, { passive: true });
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("portfolio:cat", onSignal);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(hoverTimer); clearTimeout(settleTimer); clearInterval(timer);
      window.removeEventListener("pointermove", move); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", resize);
      document.removeEventListener("focusin", focus); document.removeEventListener("focusout", blur); document.removeEventListener("input", input); document.removeEventListener("change", change); document.removeEventListener("pointerover", over); document.removeEventListener("pointerout", out);
      document.removeEventListener("click", click); document.removeEventListener("keydown", escape); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("portfolio:cat", onSignal);
    };
  }, [mounted, pathname, relocate, keepClear, signal, fitBubble, faceForTravel, stopActivity]);

  useEffect(() => {
    if (!reaction || !ai.current.enabled || !AI_SIGNALS.has(reaction.signal) || ai.current.attempts >= 6 || Date.now() - ai.current.lastRequest < 45000) return;
    const abort = new AbortController();
    ai.current.abort = abort; ai.current.lastRequest = Date.now(); ai.current.attempts++;
    const timeout = window.setTimeout(() => abort.abort(), 5000);
    fetch("/api/cat-comment", { method: "POST", signal: abort.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ signal: reaction.signal, section: reaction.context.section, appearance: reaction.context.appearance, theme: reaction.context.theme }) })
      .then(response => response.ok ? response.json() : null)
      .then(result => { if (!abort.signal.aborted && activeReaction.current?.id === reaction.id && typeof result?.text === "string" && result.text.length <= 140) setAiComment({ id: reaction.id, text: result.text }); })
      .catch(() => {}).finally(() => window.clearTimeout(timeout));
    return () => { abort.abort(); window.clearTimeout(timeout); };
  }, [reaction]);

  const placeAfterDrag = (requested: CatPoint) => {
    const node = root.current;
    if (!node) return;
    const point = chooseCatDrop(requested, window.innerWidth, window.innerHeight, node.offsetWidth, node.offsetHeight, visibleObstacles(node));
    const now = performance.now();
    position.current = { ...point, variation: position.current.variation };
    presence.current.lastMove = now; presence.current.lastRoam = now; presence.current.manualUntil = now + (catInMobileCenter(point.x, window.innerWidth, node.offsetWidth) ? CAT_MOBILE_CENTER_VISIT_MS : 10_000); lastCuddle.current = now;
    node.dataset.side = point.x > window.innerWidth / 2 ? "right" : "left";
    node.dataset.landing = "true";
    delete node.dataset.dragging;
    faceForTravel(node, point, 280);
    node.style.setProperty("--companion-x", `${point.x}px`); node.style.setProperty("--companion-y", `${point.y}px`);
    setLanding(true); window.clearTimeout(landingTimer.current);
    landingTimer.current = window.setTimeout(() => setLanding(false), 500);
    fitBubble();
  };
  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0 || !root.current) return;
    const box = root.current.getBoundingClientRect();
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: { x: box.x, y: box.y }, moved: false, lastX: event.clientX, facingX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesture = drag.current, node = root.current;
    if (!gesture || gesture.id !== event.pointerId || !node) return;
    const dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
    if (!gesture.moved && Math.hypot(dx, dy) < 6) return;
    if (!gesture.moved) {
      gesture.moved = true; node.dataset.dragging = "true"; preferences.current.dragging = true;
      setDragging(true); setLanding(false); window.clearTimeout(landingTimer.current);
      stopActivity(); controller.current?.dismiss(); controller.current?.suspend(false);
      signal("drag"); controller.current?.hold(true);
    }
    const x = Math.max(0, Math.min(window.innerWidth - node.offsetWidth, gesture.origin.x + dx));
    const y = Math.max(0, Math.min(window.innerHeight - node.offsetHeight, gesture.origin.y + dy));
    const sway = Math.max(-12, Math.min(12, (event.clientX - gesture.lastX) * .7));
    gesture.lastX = event.clientX;
    node.style.setProperty("--companion-drag-tilt", `${sway}deg`);
    node.style.setProperty("--companion-x", `${x}px`); node.style.setProperty("--companion-y", `${y}px`);
    position.current = { x, y, variation: position.current.variation };
    if (Math.abs(event.clientX - gesture.facingX) >= 2) { node.dataset.facing = event.clientX > gesture.facingX ? "right" : "left"; gesture.facingX = event.clientX; }
    fitBubble();
  };
  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    if (gesture.moved) {
      suppressClickUntil.current = performance.now() + 350;
      preferences.current.dragging = false; setDragging(false);
      controller.current?.hold(false);
      placeAfterDrag(position.current);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!mounted) return null;
  const shownActivity = !tour.state && !paused && !napping && !hidden && !reduced && !typing && !menuOpen && !dragging && !reaction ? activity : null;
  const emotion: CatEmotion = tour.state ? tour.state.phase === "moving" ? "curious" : "happy" : dragging ? "oops" : paused || napping || hidden ? "sleepy" : reaction?.emotion || (typing ? "helpful" : shownActivity ? activityEmotions[shownActivity] : presence.current.idleStage === 2 ? "sleepy" : "welcome");
  const text = (aiComment && aiComment.id === reaction?.id ? aiComment.text : reaction?.text) ?? "";
  const closeMenu = () => { setMenuOpen(false); controls.current?.focus(); };
  const askForHelp = () => { changeRestMode("active"); closeMenu(); controller.current?.suspend(false); signal("help"); };
  const askForActivity = () => {
    changeRestMode("active"); closeMenu(); controller.current?.suspend(false);
    const next = activityCycle.current.play(performance.now());
    requestedActivity.current = true; currentActivity.current = next; setActivity(next);
  };

  if (hidden) return <button type="button" className="companion-return" aria-label="Bring back the cat companion" data-theme-cycle-ignore onClick={() => { setHidden(false); changeRestMode("active"); }}><span className="brand-mark" aria-hidden="true" /></button>;

  return <><div className="cat-companion-layer" data-tour={Boolean(tour.state) || undefined}><div ref={root} className="cat-companion" data-tour={tour.state?.phase} data-tour-kind={tour.state?.kind} data-tour-mode={tour.state?.step?.mode} data-tour-theme={tour.state?.step?.theme} data-mood={emotion} data-rest={restMode} data-reaction={reaction?.signal} data-dragging={dragging || undefined} data-landing={landing || undefined} data-activity={shownActivity || undefined} style={shownActivity ? { "--companion-activity-duration": `${CAT_ACTIVITY_DURATIONS[shownActivity]}ms` } as CSSProperties : undefined} data-section={context.current.section} data-motion={!paused && !reduced} data-facing="left" data-side="right" data-theme-cycle-ignore aria-label="Cat companion"
    onPointerEnter={event => { interacting.current.pointer = event.pointerType !== "touch"; stopActivity(); }}
    onPointerLeave={() => { interacting.current.pointer = false; }}
    onPointerDownCapture={() => { inputModality.current = "pointer"; interacting.current.focus = false; }}
    onFocusCapture={() => { interacting.current.focus = inputModality.current === "keyboard"; stopActivity(); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) interacting.current.focus = false; }}>
    {tour.state?.text ? <div className="companion-speech companion-tour-speech">
      <CatSpeechText key={tour.state.text} text={tour.state.text} icon="🐾" reduced={reduced} quick={tour.state.kind === "tour" && tour.state.phase !== "guiding"} />
      {tour.state.kind === "play" || tour.state.phase === "guiding" ? <div className="companion-tour-footer"><span>{tour.state.kind === "tour" ? "Make yourself at home" : tour.state.step ? tour.state.phase === "moving" ? `Next: ${tour.state.step.name}` : tour.state.step.name : "A tiny experiment"}</span><button type="button" onClick={() => tour.stop()}>{tour.state.kind === "play" ? "Stop playing" : "Got it"}</button></div> : null}
    </div> : !tour.state && reaction && (dragging || (!menuOpen && !paused && !napping && (!typing || FORM_SIGNALS.has(reaction.signal)))) ? <div key={reaction.id} className="companion-speech" data-ai={aiComment?.id === reaction.id || undefined}
      onPointerEnter={() => { bubbleEngagement.current.pointer = true; controller.current?.hold(true); }}
      onPointerLeave={() => { bubbleEngagement.current.pointer = false; controller.current?.hold(preferences.current.dragging || bubbleEngagement.current.focus); }}
      onFocusCapture={() => { bubbleEngagement.current.focus = true; controller.current?.hold(true); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { bubbleEngagement.current.focus = false; controller.current?.hold(preferences.current.dragging || bubbleEngagement.current.pointer); } }}>
      <button type="button" className="companion-dismiss" aria-label="Dismiss cat comment" onClick={() => { controller.current?.dismiss(); pet.current?.focus(); }}><X size={13} aria-hidden="true" /></button>
      <CatSpeechText key={`${reaction.id}:${text}`} text={text} icon={emotionIcons[emotion]} reduced={reduced} />
      {reaction.action === "explore" ? <a className="companion-action" href="/#exploration" onClick={() => controller.current?.dismiss()}>Show me the studio<span aria-hidden="true">↗</span></a> : null}
    </div> : null}
    <button ref={pet} type="button" className="companion-pet" draggable={false} aria-describedby={dragInstructionsId} aria-label={paused || napping ? "Wake the cat companion" : "Pet the cat companion"} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag} onKeyDown={event => {
      const direction: Record<string, CatPoint> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
      const step = direction[event.key];
      if (!step) return;
      event.preventDefault(); stopActivity(); controller.current?.dismiss();
      const amount = event.shiftKey ? 8 : 28;
      placeAfterDrag({ x: position.current.x + step.x * amount, y: position.current.y + step.y * amount });
    }} onClick={event => {
      if (event.detail > 0 && performance.now() < suppressClickUntil.current) return;
      if (paused || napping) { changeRestMode("active"); return; }
      signal("pet");
      const box = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--touch-x", `${event.detail ? event.clientX - box.left : box.width / 2}px`);
      event.currentTarget.style.setProperty("--touch-y", `${event.detail ? event.clientY - box.top : box.height / 2}px`);
      setTouchPulse(value => value + 1);
    }} onPointerEnter={event => { if (event.pointerType !== "touch" && signal("cuddle")) lastCuddle.current = performance.now(); }}>
      <span className="companion-shadow" aria-hidden="true" />
      <CatFace emotion={emotion} maskId={`cat-mask-${maskId}`} activity={shownActivity} />
      <span className="companion-glyph" data-sleeping={emotion === "sleepy" || undefined} aria-hidden="true">{emotion === "sleepy" ? <><i>z</i><i>z</i><i>Z</i></> : tour.state || reaction || dragging ? faces[emotion].glyph : ""}</span>
      {touchPulse ? <span key={touchPulse} className="companion-touch" aria-hidden="true" /> : null}
      {emotion === "excited" ? <span key={reaction?.id} className="companion-sparks" aria-hidden="true"><i /><i /><i /></span> : null}
    </button>
    <div className="companion-tools">
      <button type="button" aria-label={paused ? "Resume cat movement" : "Pause cat movement"} aria-pressed={paused} onClick={() => changeRestMode(paused ? "active" : "paused")}>{paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}</button>
      <button ref={controls} type="button" aria-label="Cat companion controls" aria-expanded={menuOpen} aria-controls={controlsId} onClick={() => setMenuOpen(value => !value)}><Ellipsis size={15} aria-hidden="true" /></button>
    </div>
    {menuOpen ? <div id={controlsId} className="companion-controls"><p>A curious little companion</p><button type="button" onClick={askForHelp}>What can I try?</button>{!reduced && pathname === "/" ? <><button type="button" onClick={() => { changeRestMode("active"); setMenuOpen(false); tour.request("tour"); }}>Show me all five themes</button><button type="button" onClick={() => { changeRestMode("active"); setMenuOpen(false); tour.request("play"); }}>Play with the theme picker</button></> : null}{!reduced ? <button type="button" onClick={askForActivity}>Do something silly</button> : null}<button type="button" onClick={() => { closeMenu(); changeRestMode(napping ? "active" : "napping"); }}>{napping ? "Come explore with me" : "Take a little nap"}</button><button type="button" onClick={() => { setMenuOpen(false); setHidden(true); }}>Hide companion</button><button type="button" onClick={closeMenu}>Close controls</button></div> : null}
    <span className="sr-only" role="status" aria-live="polite">{tour.state ? tour.state.text : reaction && ANNOUNCE_SIGNALS.has(reaction.signal) ? text : ""}</span>
    <span id={dragInstructionsId} className="sr-only">Drag to move the cat. You can also use the arrow keys; hold Shift for smaller steps. Press Enter to pet it.</span>
  </div>{tour.state?.phase === "tapping" && tourTouch ? <span key={tourTouch.serial} className="companion-tour-touch" style={{ left: tourTouch.x, top: tourTouch.y }} aria-hidden="true"><svg viewBox="0 0 32 24"><path d="M12 3Q18 0 23 4Q30 8 25 18Q20 24 9 19Q3 13 8 8Z" fill="currentColor" /><path d="M12 11L12 16M17 11L17 17M22 11L21 16" fill="none" stroke="var(--color-paper)" strokeWidth="1.2" strokeLinecap="round" /></svg></span> : null}</div>{tour.state?.kind === "tour" && tour.state.phase !== "guiding" ? <button type="button" className="companion-tour-skip" data-theme-cycle-ignore aria-label="Skip theme tour" onClick={() => tour.stop()}><X size={14} aria-hidden="true" />Skip tour</button> : null}</>;
}
