"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, SlidersHorizontal, Move, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { themeEntrance, themeTransition } from "@/lib/themes";
export function InteractionDemo({ index }: { index: number }) {
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState("Design");
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(true);
  const [grouped, setGrouped] = useState(true);
  const [hits, setHits] = useState(0);
  const [noteX, setNoteX] = useState(0);
  const { theme, reduced } = usePortfolioTheme();
  const transition = themeTransition(theme, reduced);
  const entrance = themeEntrance(theme, reduced);

  if (index === 0) return <div className="relative text-center">
    <motion.button type="button" aria-pressed={saved} onClick={() => setSaved(!saved)} whileTap={reduced ? undefined : { scale: 0.96 }} className={`lab-save ${saved ? "is-saved" : ""}`}>
      <span className="relative size-[18px]" aria-hidden="true"><AnimatePresence initial={false} mode="wait"><motion.span key={saved ? "check" : "plus"} className="absolute inset-0" initial={reduced ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}>{saved ? <Check size={18} /> : <Plus size={18} />}</motion.span></AnimatePresence></span>
      {saved ? "Saved to collection" : "Save this idea"}
    </motion.button>
    <AnimatePresence>{saved && theme === "play" && !reduced && <span className="pointer-events-none absolute inset-0" aria-hidden="true">{[-2, -1, 0, 1, 2].map(i => <motion.span key={i} className="absolute left-1/2 top-3 size-2 rounded-sm bg-accent" initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: i * 32, y: -45 - Math.abs(i) * 5, opacity: 0, rotate: i * 50 }} transition={{ duration: 0.6 }} />)}</span>}</AnimatePresence>
    <p className="mt-5 text-xs text-muted" aria-live="polite">{saved ? "Done. Click to reset." : "Click for a little confirmation."}</p>
  </div>;

  if (index === 1) return <div className="w-full max-w-[300px]">
    <div className="demo-control-track flex" role="group" aria-label="Preview category">{["Design", "Code", "Flow"].map(item => <button type="button" key={item} aria-pressed={view === item} onClick={() => setView(item)} className="relative min-h-11 flex-1 text-xs"><span className="relative z-10">{item}</span>{view === item && <motion.span layoutId="lab-selection" transition={transition} className="demo-selection absolute inset-0" />}</button>)}</div>
    <div className="mt-7 min-h-16 text-center" aria-live="polite"><AnimatePresence initial={false} mode="wait"><motion.p key={view} initial={entrance} animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={transition} className="font-editorial text-3xl italic">{view === "Design" ? "Shape an idea." : view === "Code" ? "Make it work." : "Connect every step."}</motion.p></AnimatePresence></div>
    <div className="h-5" aria-hidden="true">{theme === "blueprint" && <svg viewBox="0 0 240 20" fill="none" className="mx-auto h-5 w-[210px] max-w-full text-accent"><motion.path key={view} d="M8 10H82L94 3H146L158 10H232" stroke="currentColor" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={reduced ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }} />{[8,120,232].map((cx,i) => <circle key={cx} cx={cx} cy={cx === 120 ? 3 : 10} r="3" stroke="currentColor" fill={i === ["Design", "Code", "Flow"].indexOf(view) ? "currentColor" : "var(--theme-tint-b)"} />)}</svg>}</div>
  </div>;

  if (index === 2) return <div className="demo-workspace w-full max-w-[290px] p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><span className="text-sm font-medium">Your workspace</span><span className="size-2 rounded-full bg-[var(--theme-success)]" aria-hidden="true" /></div>
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="lab-settings" className="theme-border flex min-h-11 w-full items-center justify-between border-t text-xs">Customize<motion.span animate={{ rotate: open && !reduced ? 90 : 0 }} transition={transition}><SlidersHorizontal size={16} aria-hidden="true" /></motion.span></button>
    <motion.div id="lab-settings" initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={transition} className="overflow-hidden" inert={!open}><label className="flex items-center justify-between text-xs">Email updates<input type="checkbox" defaultChecked className="size-4" /></label><label className="flex items-center justify-between text-xs">Weekly digest<input type="checkbox" className="size-4" /></label></motion.div>
  </div>;

  if (index === 3) return <div className="w-full text-center">
    <button type="button" onClick={() => setLarge(!large)} aria-pressed={large} className="theme-outline mb-5 min-h-11 border px-4 text-xs">{large ? "Try a smaller target" : "Try a larger target"}</button>
    <div className="flex h-16 items-center justify-center"><motion.button type="button" onClick={() => setHits(hits + 1)} whileTap={reduced ? undefined : { scale: 0.96 }} className={`theme-button ${large ? "min-h-12 px-8 text-sm" : "min-h-6 px-3 text-[10px]"}`}>Continue ↗</motion.button></div>
    <p className="mt-4 text-xs text-muted" aria-live="polite">{hits} successful {hits === 1 ? "click" : "clicks"} · demonstration, not a timed study</p>
  </div>;

  if (index === 4) return <div className="w-full max-w-[290px]">
    <button type="button" onClick={() => setGrouped(!grouped)} aria-pressed={grouped} className="theme-outline mb-4 min-h-11 border px-4 text-xs">{grouped ? "Remove grouping" : "Group related items"}</button>
    <div className={`grid grid-cols-2 text-xs ${grouped ? "gap-x-6 gap-y-6" : "gap-2"}`}>{["Project", "Owner", "Zuno", "Tamir"].map((label, i) => <motion.span layout={!reduced} transition={transition} key={label} className={`group-item ${grouped && i < 2 ? "text-muted" : ""} ${grouped && i > 1 ? "-mt-4" : ""} rounded-md p-2`}>{label}</motion.span>)}</div>
  </div>;

  return <div className="w-full">
    <div className="demo-note-canvas flex h-[156px] w-full items-center justify-center overflow-hidden border border-dashed"><motion.div drag={!reduced} dragConstraints={{ left: -40, right: 40, top: -18, bottom: 18 }} dragSnapToOrigin dragElastic={theme === "play" ? 0.2 : 0.06} animate={{ x: noteX }} whileDrag={reduced ? undefined : { rotate: theme === "play" ? 8 : theme === "swiss" ? 0 : 3, scale: 1.03 }} transition={transition} className="demo-note flex h-28 w-40 cursor-grab touch-none flex-col justify-between rounded-sm p-4 shadow-md active:cursor-grabbing"><Move size={17} aria-hidden="true" /><span className="font-editorial text-2xl italic">Make room<br />for curiosity.</span></motion.div></div>
    <div className="mt-2 flex items-center justify-center gap-3" role="group" aria-label="Move note"><button type="button" className="theme-outline grid size-11 place-items-center border" aria-label="Nudge note left" onClick={() => setNoteX(x => Math.max(-40, x - 20))}><ArrowLeft size={15} aria-hidden="true" /></button><button type="button" className="theme-outline grid size-11 place-items-center border" aria-label="Reset note position" onClick={() => setNoteX(0)}><RotateCcw size={14} aria-hidden="true" /></button><button type="button" className="theme-outline grid size-11 place-items-center border" aria-label="Nudge note right" onClick={() => setNoteX(x => Math.min(40, x + 20))}><ArrowRight size={15} aria-hidden="true" /></button></div>
  </div>;
}
