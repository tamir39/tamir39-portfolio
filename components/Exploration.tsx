"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StudioNotebookPreview, NotebookArtwork } from "./StudioNotebookPreview";
import { GameCoachmark } from "./GameCoachmark";
import { workflowStages } from "./WorkflowStudy";
import { practiceSteps } from "./MakeItYoursStudy";
import { designSkills } from "@/lib/design-skills";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { themes } from "@/lib/themes";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, Compass, Layers, Palette, Sparkles, Workflow } from "lucide-react";

const sources = {
  awwwards: { name: "Awwwards", href: "https://www.awwwards.com/" },
  pinterest: { name: "Pinterest", href: "https://www.pinterest.com/" },
  colors: { name: "Color Hunt", href: "https://colorhunt.co/" },
  md: { name: "DESIGN.md directory", href: "https://designdotmd.directory/" },
  prompts: { name: "Design Prompts", href: "https://www.designprompts.dev/" },
  motion: { name: "Motion", href: "https://motion.dev/" },
  ux: { name: "Laws of UX", href: "https://lawsofux.com/" },
  shadcn: { name: "shadcn/ui", href: "https://ui.shadcn.com/" },
  components: { name: "21st.dev", href: "https://21st.dev/" },
  impeccable: { name: "Impeccable", href: "https://impeccable.style/" },
  open: { name: "Open Design", href: "https://open-design.ai/" },
  pencil: { name: "Pencil", href: "https://www.pencil.dev/" },
  miro: { name: "Miro", href: "https://miro.com/" },
  firecrawl: { name: "Firecrawl", href: "https://www.firecrawl.dev/" },
  composio: { name: "Composio", href: "https://composio.dev/" },
};

const studies = [
  { name: "Visual direction", icon: Palette, title: "Borrow the feeling. Find my own expression.", study: "I explore palettes, editorial layouts, typography, and the way a page creates a mood.", combine: "I combine visual references with shared design tokens, then adjust hierarchy and spacing to fit the content and screen.", sources: [sources.awwwards, sources.pinterest, sources.colors, sources.md, sources.prompts], example: "Compare this portfolio’s five themes", href: "/#lab", result: "One experience, five visual directions" },
  { name: "Motion & feeling", icon: Sparkles, title: "Give movement a reason.", study: "I look at transitions, spring motion, hover feedback, and how movement can connect two states.", combine: "I bring expressive motion together with useful feedback, viewport-aware playback, and controls for people who prefer less movement.", sources: [sources.motion, sources.components, sources.awwwards], example: "Explore CausaSent’s animated flow", href: "/missions/causasent", result: "A process you can follow at your own pace" },
  { name: "UX & logic", icon: Workflow, title: "Make the next step feel obvious.", study: "I explore choice, proximity, target size, and how familiar patterns help people understand an interface.", combine: "I connect those principles to real task flows, then adapt the hierarchy and controls for the screen. Discover, choose, review, and confirm should stay clear at every size.", sources: [sources.ux, sources.miro], example: "See Joi’s menu and checkout flow", href: "/missions/joi-vn", result: "Visual clarity connected to application logic" },
  { name: "Component craft", icon: Layers, title: "A good pattern is a starting point.", study: "I explore reusable controls, component composition, and the details that make an interface feel consistent.", combine: "I adapt patterns to the product’s roles, content, and responsive layout, then refine empty, loading, and interaction states.", sources: [sources.shadcn, sources.components, sources.impeccable], example: "Explore Moza’s role-based interfaces", href: "/missions/moza", result: "Different responsibilities, a familiar workspace" },
  { name: "Design workflow", icon: Compass, title: "Explore widely. Refine in the browser.", study: "I explore canvas tools, design guidance, and ways to organize references before turning an idea into an interface.", combine: "I move from references to a prototype, then refine the layout, copy, and interaction around the actual task. The tools support the decisions; I keep shaping the result.", sources: [sources.open, sources.pencil, sources.impeccable, sources.miro], example: "See how I built our studio’s website", href: "/missions/100b-studio", result: "References → experiments → working interfaces" },
  { name: "Skills & practice", icon: BookOpen, title: "Turn guidance into decisions.", study: "", combine: "", sources: [], example: "", href: "/#lab", result: "" },
];

const referenceShelf = [...Object.values(sources), ...designSkills.map(skill => ({ name: `${skill.name} · skill`, href: skill.href }))];

const chapterIds = ["visual", "motion", "ux", "components", "workflow", "practice"];
const notebookSections = [
  { id: "games", start: 0, end: 4, reversed: false },
  { id: "process", start: 4, end: 6, reversed: true },
];
const openings = [
  { title: "Choose a feeling.", copy: "I use type, color, and space to give the same idea a different point of view." },
  { title: "Make actions feel alive.", copy: "A little movement can make an action feel clear, useful, and satisfying." },
  { title: "Give every screen room.", copy: "I adapt the layout so the next step stays clear, from a phone to a wider screen." },
  { title: "Small pieces. One language.", copy: "Reusable components bring familiar behavior to different parts of a product." },
  { title: "Good ideas need a way forward.", copy: "I turn a loose direction into something people can use. Shape the flow, build the interface, then refine the details that make it feel right." },
  { title: "Learn it. Make it yours.", copy: "Good guidance is a starting point. The choices I make with it give the work a point of view." },
];
const challenges = [
  { title: "Give the studio a new mood.", success: "New mood discovered.", hint: "Change the style. Watch the same interface transform.", done: "You changed the style. Your mood discovery is saved.", stamp: "Mood" },
  { title: "Save a little inspiration.", success: "Inspiration saved.", hint: "Tap the heart in the phone. Notice how the button answers back.", done: "You tried the feedback, from action to answer.", stamp: "Feedback" },
  { title: "Try the tablet layout.", success: "Tablet layout discovered.", hint: "Choose Tablet. Watch the same studio expand into a wider layout.", done: "You expanded the studio into a tablet layout. Keep exploring the other views.", stamp: "Responsive" },
  { title: "Move a piece. Keep the system.", success: "Component discovery unlocked.", hint: "Drag the note, or focus it and use the arrow keys.", done: "You moved an independent piece within the composition.", stamp: "Components" },
];
const gameTips = [
  { target: "#studio-visual .notebook-challenge-action", message: "Click here to give the studio a new mood." },
  { target: ".notebook-phone-scene .journey-save", message: "Click the heart. Watch the idea save." },
  { target: '.notebook-device-modes button[data-mode="tablet"]', message: "Click Tablet. Watch the studio expand." },
  { target: ".notebook-loose-note", message: "Drag this note, or focus it and use the arrow keys." },
];
const celebrationParticles = [[-70, -42], [-52, -70], [-32, -82], [-12, -54], [14, -72], [34, -86], [52, -62], [70, -38]];

function CompletionBurst() {
  return <span className="notebook-completion-burst" aria-hidden="true">{celebrationParticles.map(([x, y], index) => <i key={index} style={{ "--burst-x": `${x}px`, "--burst-y": `${y}px`, "--burst-turn": `${index % 2 ? 160 : -180}deg`, "--burst-delay": `${index * 25}ms` } as CSSProperties} />)}</span>;
}

export function Exploration() {
  const previews = useRef<(HTMLElement | null)[]>([]);
  const notebook = useRef<HTMLDivElement>(null);
  const previewInteraction = useRef(false);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [workflowStage, setWorkflowStage] = useState(0);
  const [practiceStage, setPracticeStage] = useState(0);
  const [discoveries, setDiscoveries] = useState<number[]>([]);
  const [dismissedTips, setDismissedTips] = useState<number[]>([]);
  const { theme, setTheme, reduced } = usePortfolioTheme();
  const current = themes.find(item => item.id === theme)!;
  function discover(chapter: number) {
    setDiscoveries(previous => previous.includes(chapter) ? previous : [...previous, chapter]);
  }
  function dismissTip(chapter: number) {
    setDismissedTips(previous => previous.includes(chapter) ? previous : [...previous, chapter]);
  }
  useEffect(() => {
    if (discoveries.length) window.dispatchEvent(new CustomEvent("portfolio:cat", { detail: { signal: "discovery", count: discoveries.length } }));
  }, [discoveries.length]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const sync = () => setDesktop(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!desktop) return;
    const cards = previews.current.filter((card): card is HTMLElement => card !== null);
    // Center the complete card, including the chapter rail and changing controls.
    const measure = () => cards.forEach(card => card.style.setProperty("--notebook-preview-height", `${card.offsetHeight}px`));
    measure();
    const observer = new ResizeObserver(measure);
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [desktop]);
  useEffect(() => {
    const root = notebook.current;
    if (!root || !desktop) return;
    const tracks = [
      { chapter: root.querySelector("#studio-workflow"), selector: "[data-workflow-step]", setStage: setWorkflowStage },
      { chapter: root.querySelector("#studio-practice"), selector: "[data-practice-step]", setStage: setPracticeStage },
    ].map(track => ({ ...track, steps: Array.from(track.chapter?.querySelectorAll<HTMLElement>(track.selector) ?? []) }));
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = window.innerHeight * .52;
      tracks.forEach(track => {
        let next = 0;
        track.steps.forEach((step, index) => {
          if (step.getBoundingClientRect().top <= readingLine) next = index;
        });
        track.setStage(next);
      });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    const observer = new ResizeObserver(schedule);
    tracks.forEach(track => { if (track.chapter) observer.observe(track.chapter); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [desktop]);
  useEffect(() => {
    const root = notebook.current;
    if (!root || !desktop) return;
    const articles = Array.from(root.querySelectorAll<HTMLElement>(".notebook-chapter"));
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const visible = new Set<Element>();
      // IntersectionObserver resolves percentage margins against viewport width.
      // Use height-based pixels so wide, short windows retain a real reading band.
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        if (visible.size && !previewInteraction.current) {
          const nearest = [...visible].sort((a, b) => Math.abs(a.getBoundingClientRect().top - window.innerHeight * .3) - Math.abs(b.getBoundingClientRect().top - window.innerHeight * .3))[0];
          setActive(articles.indexOf(nearest as HTMLElement));
        }
      }, { rootMargin: `-${Math.round(window.innerHeight * .18)}px 0px -${Math.round(window.innerHeight * .62)}px 0px`, threshold: 0 });
      articles.forEach(article => observer.observe(article));
    };
    observe();
    const resumeReading = () => {
      const wasInteracting = previewInteraction.current;
      previewInteraction.current = false;
      if (wasInteracting) observe();
    };
    const resumeFromKey = (event: KeyboardEvent) => {
      if (["PageUp", "PageDown", "Home", "End"].includes(event.key) && !(event.target instanceof HTMLInputElement)) resumeReading();
    };
    window.addEventListener("resize", observe);
    window.addEventListener("wheel", resumeReading, { passive: true });
    window.addEventListener("touchmove", resumeReading, { passive: true });
    window.addEventListener("keydown", resumeFromKey);
    return () => { observer.disconnect(); window.removeEventListener("resize", observe); window.removeEventListener("wheel", resumeReading); window.removeEventListener("touchmove", resumeReading); window.removeEventListener("keydown", resumeFromKey); };
  }, [desktop]);
  return <section id="exploration" aria-labelledby="exploration-heading" className="exploration-studio studio-scroll-notebook">
    <div className="studio-heading">
      <div><p className="section-eyebrow">The exploration studio</p><h2 id="exploration-heading">Collect ideas.<br /><span className="font-editorial italic text-accent">Make them feel alive.</span></h2></div>
      <p>A look inside my process. From a first feeling to a working interface, one decision at a time.</p>
    </div>
    <div ref={notebook} className="notebook-sections" onClickCapture={event => {
      if (event.target instanceof Element && event.target.closest(".notebook-challenge-action,.journey-save,.notebook-device-modes button")) dismissTip(active);
    }} onPointerDownCapture={event => {
      if (event.target instanceof Element && event.target.closest(".notebook-loose-note")) dismissTip(3);
    }} onKeyDownCapture={event => {
      if (event.target instanceof Element && event.target.closest(".notebook-loose-note") && event.key.startsWith("Arrow")) dismissTip(3);
    }}>
      {notebookSections.map((group, groupIndex) => {
        const chapter = Math.max(group.start, Math.min(active, group.end - 1));
        const previewCard = <aside ref={element => { previews.current[groupIndex] = element; }} className="notebook-live-preview" aria-label={group.reversed ? "Process studio preview" : "Interactive studio preview"} onPointerDown={() => { previewInteraction.current = true; }} onFocusCapture={() => { previewInteraction.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) previewInteraction.current = false; }}>
          <div className="studio-preview-bar"><span><span className="studio-status-dot" />{studies[chapter].name}</span><span>{current.name} / 0{chapter + 1}</span></div>
          {desktop && <StudioNotebookPreview chapter={chapter} onDiscover={discover} workflowStage={workflowStage} practiceStage={practiceStage} />}
          <nav className="notebook-rail" aria-label={group.reversed ? "Process notebook chapters" : "Interactive notebook chapters"}><span className="notebook-rail-label">Chapters</span>{studies.map((item, index) => <a key={item.name} href={`#studio-${chapterIds[index]}`} onClick={() => { setActive(index); previewInteraction.current = true; }} aria-label={`0${index + 1} ${item.name}`} title={item.name} aria-current={chapter === index ? "step" : undefined}><span>0{index + 1}</span><item.icon size={13} aria-hidden="true" /></a>)}</nav>
        </aside>;
        return <div key={group.id} className="notebook-layout" data-phase={group.id}>
        {!group.reversed && previewCard}
      <div className="notebook-pages">
        {studies.slice(group.start, group.end).map((study, localIndex) => {
          const index = group.start + localIndex;
          const challenge = challenges[index];
          const complete = discoveries.includes(index);
          return <article id={`studio-${chapterIds[index]}`} key={study.name} className="notebook-chapter" aria-labelledby={`studio-title-${index}`}>
          <motion.div className="notebook-chapter-heading" initial={false} whileInView={reduced ? undefined : index % 3 === 0 ? { opacity: [0, 1], y: [28, 0], rotate: [-1, 0] } : index % 3 === 1 ? { opacity: [0, 1], x: [-20, 0] } : { opacity: [0, 1], y: [10, 0], filter: ["blur(5px)", "blur(0px)"] }} viewport={{ once: true, amount: .25 }} transition={{ duration: .75, ease: [.16, 1, .3, 1] }}>
            <p className="notebook-chapter-label"><span>0{index + 1}</span><study.icon size={15} aria-hidden="true" />{study.name}</p>
            <h3 id={`studio-title-${index}`}>{index === 5 ? <><span>Learn it.</span><em>Make it yours.</em></> : openings[index].title}</h3>
          </motion.div>
          <motion.p className="notebook-intro" initial={false} whileInView={reduced ? undefined : { opacity: [0, 1], y: [16, 0] }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7, delay: .1 }}>{openings[index].copy}</motion.p>
          {!desktop && <NotebookArtwork chapter={index} />}
          {desktop && index === 4 && <ol className="workflow-story" aria-label="From idea to interface" data-theme-cycle-ignore>{workflowStages.map((step, number) => <li key={step.name} data-workflow-step={number} aria-current={workflowStage === number ? "step" : undefined}><div><p className="workflow-story-label"><span>0{number + 1}</span><step.icon size={14} aria-hidden="true" />{step.name}</p><h4>{step.title}</h4><p>{step.copy}</p></div></li>)}</ol>}
          {desktop && index === 5 && <ol className="workflow-story practice-story" aria-label="From learning to a point of view" data-theme-cycle-ignore>{practiceSteps.map((step, number) => <li key={step.name} data-practice-step={number} aria-current={practiceStage === number ? "step" : undefined}><div><p className="workflow-story-label"><span>0{number + 1}</span><step.icon size={14} aria-hidden="true" />{step.name}</p><h4>{step.title}</h4><p>{step.copy}</p></div></li>)}</ol>}
          {desktop && challenge && <div className="notebook-challenge" data-complete={complete}>
            <p className="notebook-challenge-eyebrow">{complete ? <><motion.span className="notebook-success-icon" initial={reduced ? false : { scale: .25, opacity: 0, filter: "blur(4px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ type: "spring", duration: reduced ? 0 : .3, bounce: 0 }}><Check size={16} strokeWidth={2.5} aria-hidden="true" /></motion.span>Discovery unlocked</> : <><Sparkles size={12} aria-hidden="true" />Your turn</>}</p>
            <h4>{complete ? challenge.success : challenge.title}</h4>
            <p id={`studio-game-instruction-${index}`} className="notebook-challenge-hint">{complete ? challenge.done : challenge.hint}</p>
            {index === 0 ? <button type="button" className="notebook-challenge-action" aria-describedby={`studio-game-instruction-${index}`} onClick={() => { setTheme(themes[(themes.findIndex(item => item.id === theme) + 1) % themes.length].id); discover(0); }}>Try next mood<ArrowRight size={15} aria-hidden="true" /></button>
              : !complete && <p className="notebook-preview-cue"><ArrowLeft size={14} aria-hidden="true" />{index === 2 ? "Choose Tablet below the preview" : index === 3 ? "Try the loose note in the preview" : "Try the heart in the preview"}</p>}
            <div className="notebook-discoveries" data-all-complete={discoveries.length === challenges.length}><span>{discoveries.length === challenges.length ? "All 4 discoveries unlocked" : <><strong>{discoveries.length}</strong> of {challenges.length} discoveries</>}</span><ol aria-label="Studio discoveries">{challenges.map((challenge, number) => <li key={challenge.stamp} data-complete={discoveries.includes(number)} aria-label={`${challenge.stamp}: ${discoveries.includes(number) ? "discovered" : "still to explore"}`} title={challenge.stamp}>{discoveries.includes(number) ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <span aria-hidden="true">{number + 1}</span>}</li>)}</ol>{discoveries.length === challenges.length && index === discoveries[discoveries.length - 1] && <CompletionBurst />}</div>
          </div>}
          <details className="notebook-study-notes"><summary>{index === 5 ? "Guides I put into practice" : "Notes & references"}</summary>
            {index === 5 ? <div className="notebook-skill-list">{designSkills.map(skill => <a key={skill.id} href={skill.href} target="_blank" rel="noopener noreferrer"><span><strong>{skill.name}</strong><small>{skill.focus} · {skill.author}</small></span><ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>
              : <><div className="notebook-margin-note"><div><h4>How I approach it</h4><p>{study.combine}</p></div></div><div className="notebook-sources"><span>On my reference shelf</span><div>{study.sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.name}<ArrowUpRight size={10} aria-hidden="true" /></a>)}</div></div></>}
          </details>
          {index > 0 && index !== 5 && <Link href={study.href} className="notebook-work-link">{study.example}<ArrowRight size={16} aria-hidden="true" /></Link>}
          {index === 5 && <a href="#work" className="notebook-work-link practice-work-link">See what I made<ArrowRight size={16} aria-hidden="true" /></a>}
        </article>; })}
      </div>
        {group.reversed && previewCard}
      </div>; })}
      {desktop && active < gameTips.length && <GameCoachmark key={active} root={notebook} target={gameTips[active].target} message={gameTips[active].message} visible={!discoveries.includes(active) && !dismissedTips.includes(active)} onDismiss={() => dismissTip(active)} />}
    </div>
    {desktop && <p className="sr-only" role="status">{discoveries.length ? `${challenges[discoveries[discoveries.length - 1]].success} ${discoveries.length === challenges.length ? "All 4 studio discoveries unlocked." : `${discoveries.length} of ${challenges.length} studio discoveries unlocked.`}` : ""}</p>}
    <details className="studio-shelf"><summary>Open the full reference shelf <span>{referenceShelf.length} sources ↗</span></summary><p>Design references, workflow tools, and AI skill guides I explore. Each source belongs to its original creators.</p><div>{referenceShelf.map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.name}<ArrowUpRight size={13} aria-hidden="true" /></a>)}</div></details>
  </section>;
}
