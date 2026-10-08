"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Layers, Monitor, Palette, RotateCcw, Sparkles } from "lucide-react";
import { StudioInterface } from "./StudioInterface";
import { themes } from "@/lib/themes";
import { usePortfolioTheme } from "./providers/ThemeProvider";

const chapters = [
  { title: "Collect a feeling.", caption: "01 / THE SPARK", text: "A palette, a typeface, a moment that stays with you. I collect what makes an interface feel a certain way, then find a direction of my own.", task: "Choose a mood. Watch the whole studio change.", icon: Palette },
  { title: "Give the idea shape.", caption: "02 / THE DECISION", text: "A reference becomes useful when it serves the task. I shape the hierarchy, group the choices, and make the next action easy to find.", task: "Switch on hierarchy. See what becomes clear.", icon: Layers },
  { title: "Make it respond.", caption: "03 / THE FEELING", text: "The last detail is the response: a press, a change of state, a little confirmation. Motion connects what you did with what happened next.", task: "Save the idea on the phone. Feel the feedback.", icon: Sparkles },
  { title: "Make it responsive.", caption: "04 / EVERY SCREEN", text: "Give this little studio more room. The same frame widens from phone to tablet to desktop, and the layout inside adapts with it.", task: "Try the desktop view to earn your fourth stamp.", icon: Monitor },
];

export function StudioJourney({ sources }: { sources: { name: string; href: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const manualChapter = useRef(false);
  const { theme, setTheme, reduced } = usePortfolioTheme();
  const [chapter, setChapter] = useState(0);
  const [scrollStory, setScrollStory] = useState(false);
  const [refined, setRefined] = useState(false);
  const [saved, setSaved] = useState(false);
  const [explored, setExplored] = useState(chapters.map(() => false));
  const scene = useRef<HTMLDivElement>(null);
  const frameDrag = useRef({ startX: 0, startWidth: 244, scale: 1 });
  const [frameWidth, setFrameWidth] = useState(244);
  const [sceneWidth, setSceneWidth] = useState(700);
  const previewWidth = chapter === 3 ? frameWidth : 244;
  const previewScale = Math.min(1, Math.max(160, sceneWidth - 48) / previewWidth);
  useEffect(() => {
    if (!scene.current) return;
    const observer = new ResizeObserver(([entry]) => setSceneWidth(entry.contentRect.width));
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);
  const inView = useInView(root, { amount: 0 });
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const tiltX = useMotionValue(0), tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 160, damping: 26 });
  const rotateY = useSpring(tiltY, { stiffness: 160, damping: 26 });
  useEffect(() => {
    const release = () => { manualChapter.current = false; };
    const onKey = (event: KeyboardEvent) => {
      if (["PageDown", "PageUp", "Home", "End"].includes(event.key) || (event.target === document.body && ["ArrowDown", "ArrowUp", " "].includes(event.key))) release();
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("wheel", release); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px) and (min-height: 850px)");
    const sync = () => setScrollStory(media.matches && !reduced);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [reduced]);
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (scrollStory && !manualChapter.current) setChapter(Math.min(chapters.length - 1, Math.floor(Math.max(0, value) * chapters.length)));
  });
  function complete(index: number) { setExplored(previous => previous.map((value, i) => value || i === index)); }
  function resizeFrame(width: number) {
    manualChapter.current = true;
    const next = Math.max(244, Math.min(620, Math.round(width)));
    setFrameWidth(next);
    if (next >= 560) complete(3);
  }
  function goTo(index: number) {
    manualChapter.current = true;
    setChapter(index);
    if (scrollStory && root.current) {
      const box = root.current.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + box.top + (box.height - window.innerHeight) * ((index + .15) / chapters.length), behavior: "smooth" });
    }
  }
  const count = explored.filter(Boolean).length;
  const current = chapters[chapter];
  return <div ref={root} className="studio-journey" data-scroll-story={scrollStory} data-active={chapter} data-live={inView && !reduced}>
    <div className="journey-stage">
      <div className="journey-topline"><span><span className="studio-status-dot" />An idea, brought to life</span><span className="journey-scroll-hint"><ArrowDown size={12} aria-hidden="true" />Scroll the story, or choose a chapter</span></div>
      <div className="journey-composition">
        <div ref={scene} className="journey-scene">
          <div className="journey-orbits" aria-hidden="true"><i /><i /><i /></div>
          <div className="journey-reference reference-type"><span>01 / TYPE</span><strong className="font-editorial italic">Aa.</strong><small>Let the type set the tone.</small></div>
          <div className="journey-reference reference-palette"><span>02 / COLOR</span><div aria-hidden="true"><i /><i /><i /></div><small>A feeling, in three colors.</small></div>
          <div className="journey-reference reference-motion"><Sparkles size={19} aria-hidden="true" /><span>03 / RESPONSE</span><strong>Every action,<br />a little answer.</strong></div>
          <div className="journey-phone-space" style={{ width: previewWidth * previewScale, height: 510 * previewScale }}>
          <div className="journey-phone-perspective" style={{ width: previewWidth, transform: `scale(${previewScale})` }} onPointerMove={event => {
            if (reduced || chapter === 3 || event.pointerType !== "mouse") return;
            const box = event.currentTarget.getBoundingClientRect();
            tiltY.set(((event.clientX - box.left) / box.width - .5) * 10);
            tiltX.set(-((event.clientY - box.top) / box.height - .5) * 10);
          }} onPointerLeave={() => { tiltX.set(0); tiltY.set(0); }}>
            <motion.div className={`journey-phone ${refined ? "is-refined" : ""}`} style={{ width: previewWidth, rotateX: reduced || chapter === 3 ? 0 : rotateX, rotateY: reduced || chapter === 3 ? 0 : rotateY }}>
              <div className="journey-phone-status"><span>9:41</span><span aria-hidden="true">● ▰</span></div>
              <div className="journey-phone-camera" aria-hidden="true" />
              <StudioInterface saved={saved} onSave={() => { setSaved(value => !value); complete(2); }} />
              <div className="journey-phone-home" aria-hidden="true" />
            </motion.div>
          </div>
          {chapter === 3 && <div className="journey-frame-grip" aria-hidden="true" onPointerDown={event => {
            frameDrag.current = { startX: event.clientX, startWidth: previewWidth, scale: previewScale };
            event.currentTarget.setPointerCapture(event.pointerId);
          }} onPointerMove={event => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            resizeFrame(frameDrag.current.startWidth + (event.clientX - frameDrag.current.startX) * 2 / frameDrag.current.scale);
          }}><i /></div>}
          </div>
          <div className="journey-scene-label"><span>{theme} / visual study</span><span aria-hidden="true">↗</span></div>
        </div>
        <div className="journey-narrative">
          <nav className="journey-chapters" aria-label="Studio story chapters">{chapters.map((item, index) => <button type="button" key={item.caption} onClick={() => goTo(index)} aria-current={chapter === index ? "step" : undefined} aria-label={`${index + 1}. ${item.title}`}><span>{explored[index] ? <Check size={13} aria-hidden="true" /> : `0${index + 1}`}</span><item.icon size={16} aria-hidden="true" /></button>)}</nav>
          <div className="journey-chapter-copy" key={chapter}><p className="section-eyebrow">{current.caption}</p><h3>{current.title}</h3><p>{current.text}</p></div>
          <div className="journey-task"><span className="journey-task-label">YOUR TURN <ArrowRight size={13} aria-hidden="true" /></span><p>{current.task}</p>
            {chapter === 0 ? <div className="journey-moods" role="group" aria-label="Choose the studio mood">{themes.map(item => <button type="button" key={item.id} aria-pressed={theme === item.id} onClick={() => { manualChapter.current = true; setTheme(item.id); complete(0); }}><span aria-hidden="true" style={{ color: item.color }}>{item.symbol}</span>{item.name}</button>)}</div>
              : chapter === 1 ? <button className="theme-tool" type="button" aria-pressed={refined} onClick={() => { setRefined(value => !value); complete(1); }}><Layers size={15} aria-hidden="true" />{refined ? "Hierarchy on" : "Turn on hierarchy"}</button>
                : chapter === 2 ? <p className="journey-phone-prompt">{saved ? "That’s the connection: action → feedback." : "Press “Save this idea” in the phone preview."}</p>
                  : <><div className="journey-device-controls" role="group" aria-label="Studio frame size">{[{ name: "Mobile", width: 244 }, { name: "Tablet", width: 420 }, { name: "Desktop", width: 620 }].map(device => <button type="button" key={device.name} aria-pressed={frameWidth === device.width} onClick={() => resizeFrame(device.width)}>{device.name}</button>)}</div><label className="journey-width-label" htmlFor="studio-frame-width">Frame width <span>{frameWidth}px</span></label><input id="studio-frame-width" className="journey-width-slider" type="range" min={244} max={620} value={frameWidth} onChange={event => resizeFrame(Number(event.target.value))} /><p role="status">{explored[3] ? "Responsive stamp collected. Keep exploring the same studio." : "Drag the frame’s edge or slide between sizes."}</p></>}
          </div>
          <div className="journey-passport"><div><span>EXPLORER NOTES</span><strong role="status">{count === chapters.length ? "Made it feel alive. On every screen." : `${count} of ${chapters.length} ideas explored`}</strong></div><div className="journey-stamps" aria-label={`${count} of ${chapters.length} activities completed`}>{explored.map((done, index) => <span data-complete={done} key={index}>{done ? <Check size={13} aria-hidden="true" /> : index + 1}</span>)}</div><button type="button" aria-label="Reset studio activities" onClick={() => { setExplored(chapters.map(() => false)); setRefined(false); setSaved(false); setFrameWidth(244); }}><RotateCcw size={15} aria-hidden="true" /></button></div>
          <div className="journey-references"><span>ON MY REFERENCE SHELF</span>{sources.map(source => <a href={source.href} key={source.href} target="_blank" rel="noopener noreferrer">{source.name}<ArrowUpRight size={11} aria-hidden="true" /></a>)}</div>
        </div>
      </div>
      <div className="journey-bottomline"><span>References → decisions → interaction → every screen</span><span>Sample interfaces · try everything</span></div>
    </div>
  </div>;
}
