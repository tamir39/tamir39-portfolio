"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Layers, Monitor, MousePointer2, Smartphone, Sparkles, Tablet } from "lucide-react";
import { StudioInterface } from "./StudioInterface";
import { WorkflowStudy } from "./WorkflowStudy";
import { MakeItYoursStudy } from "./MakeItYoursStudy";
import { usePortfolioMotion } from "./providers/ThemeProvider";

const deviceModes = [
  { id: "phone", label: "Phone", width: 244, icon: Smartphone },
  { id: "tablet", label: "Tablet", width: 440, icon: Tablet },
  { id: "desktop", label: "Desktop", width: 620, icon: Monitor },
] as const;
type DeviceMode = (typeof deviceModes)[number]["id"];

export function NotebookArtwork({ chapter }: { chapter: number }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: .2 });
  const { reduced } = usePortfolioMotion();
  return <div ref={root} className={`notebook-art notebook-art-${chapter}`} data-live={visible && !reduced} aria-hidden={chapter >= 4 ? undefined : true}>
    {chapter === 0 ? <><span className="notebook-art-label">A study in visual feeling</span><div className="notebook-type">Aa<span>.</span></div><div className="notebook-color-strip"><i /><i /><i /><i /></div><span className="notebook-art-caption">Type. Color. A point of view.</span></>
      : chapter === 1 ? <><div className="notebook-motion-orbit"><i /><i /><Sparkles size={54} /></div><div className="notebook-feedback"><Check size={16} />A little action. A clear answer.</div></>
        : chapter === 2 ? <><div className="notebook-screens"><div><span>T / Studio</span><i /><b /><b /></div><div><span>T / Studio</span><i /><b /><b /></div><div><span>T / Studio</span><i /><b /><b /></div></div><span className="notebook-art-caption">Same idea. Room to adapt.</span></>
          : chapter === 3 ? <><span className="notebook-art-label">Small pieces. One language.</span><div className="notebook-component-stack"><div><Layers size={18} /><span>Your workspace</span><i /></div><div><span>Visual direction</span><strong>Aa</strong></div><div><span>Ready when you are</span><Check size={17} /></div></div></>
            : chapter === 4 ? <WorkflowStudy />
              : <MakeItYoursStudy />}
  </div>;
}

export function StudioNotebookPreview({ chapter, onDiscover, workflowStage, practiceStage }: { chapter: number; onDiscover: (chapter: number) => void; workflowStage: number; practiceStage: number }) {
  const host = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [phoneHeight, setPhoneHeight] = useState(560);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("phone");
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState({ x: 0, y: 0 });
  const { reduced } = usePortfolioMotion();
  const visible = useInView(host, { amount: 0 });
  const currentMode = deviceModes.find(mode => mode.id === deviceMode)!;
  const frameWidth = chapter === 2 ? currentMode.width : 244;
  const scale = Math.min(1, Math.max(100, size.width - 56) / frameWidth, Math.max(100, size.height - 48) / phoneHeight);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!phone.current) return;
    const observer = new ResizeObserver(() => {
      if (phone.current?.offsetHeight) setPhoneHeight(Math.ceil(phone.current.offsetHeight));
    });
    observer.observe(phone.current);
    return () => observer.disconnect();
  }, []);
  function exploreMode(next: DeviceMode) {
    setDeviceMode(next);
    if (next === "tablet") onDiscover(2);
  }
  return <div className="notebook-preview-content" data-responsive={chapter === 2} data-workflow={chapter === 4} data-finale={chapter === 5}>
    <div ref={host} className="notebook-preview-canvas" data-live={visible && !reduced}>
      <div className="notebook-phone-scene journey-scene" data-visible={chapter < 3}>
        <div className="journey-orbits" aria-hidden="true"><i /><i /><i /></div>
        <div className="journey-reference reference-type" aria-hidden="true"><span>01 / TYPE</span><strong className="font-editorial italic">Aa.</strong><small>Let the type set the tone.</small></div>
        <div className="journey-reference reference-palette" aria-hidden="true"><span>02 / COLOR</span><div><i /><i /><i /></div><small>A feeling, in three colors.</small></div>
        <div className="journey-reference reference-motion" aria-hidden="true"><Sparkles size={19} /><span>03 / RESPONSE</span><strong>Every action,<br />a little answer.</strong></div>
        <div className="journey-phone-space" style={{ width: frameWidth * scale, height: phoneHeight * scale }}>
          {/* Layout zoom keeps text rasterized at its displayed size as the frame fits. */}
          <div className="journey-phone-perspective" style={{ width: frameWidth, zoom: scale }}>
            <div ref={phone} className="journey-phone is-refined" data-device-mode={chapter === 2 ? deviceMode : "phone"} style={{ width: frameWidth }}>
              <div className="journey-phone-status"><span>9:41</span><span aria-hidden="true">● ▰</span></div><div className="journey-phone-camera" aria-hidden="true" />
              <StudioInterface saved={saved} saveHintId={chapter === 1 ? "studio-game-instruction-1" : undefined} onSave={() => { setSaved(value => !value); if (chapter === 1) onDiscover(1); }} />
              <div className="journey-phone-home" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      {chapter >= 3 && <motion.div className="notebook-other-scene" key={chapter} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5 }}>
        {chapter === 3 ? <div className="notebook-drag-pieces"><NotebookArtwork chapter={3} /><motion.div role="button" tabIndex={0} aria-label="Move studio note with arrow keys; Enter resets its position" aria-describedby="studio-game-instruction-3" className="notebook-loose-note" animate={note} onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(event.key)) return;
          event.preventDefault();
          if (event.key.startsWith("Arrow")) onDiscover(3);
          setNote(previous => event.key === "Enter" || event.key === " " ? { x: 0, y: 0 } : { x: Math.max(-55, Math.min(55, previous.x + (event.key === "ArrowRight" ? 15 : event.key === "ArrowLeft" ? -15 : 0))), y: Math.max(-45, Math.min(45, previous.y + (event.key === "ArrowDown" ? 15 : event.key === "ArrowUp" ? -15 : 0))) });
        }} drag={!reduced} onDragEnd={(_, info) => { if (Math.hypot(info.offset.x, info.offset.y) > 4) onDiscover(3); }} dragConstraints={{ left: -55, right: 55, top: -45, bottom: 45 }} dragSnapToOrigin whileHover={reduced ? undefined : { rotate: -4 }} whileDrag={{ scale: 1.04 }}><MousePointer2 size={18} /><span>Made to fit.<br />Built to reuse.</span></motion.div></div> : chapter === 4 ? <WorkflowStudy stage={workflowStage} scrollDriven /> : <MakeItYoursStudy stage={practiceStage} scrollDriven />}
      </motion.div>}
    </div>
    {chapter < 4 && <div className="notebook-preview-caption">
      {chapter === 2 ? <><div className="notebook-device-modes" role="group" aria-label="Device layouts" aria-describedby="studio-game-instruction-2">{deviceModes.map(mode => <button key={mode.id} type="button" data-mode={mode.id} aria-pressed={deviceMode === mode.id} onClick={() => exploreMode(mode.id)}><mode.icon size={14} aria-hidden="true" /><span>{mode.label}</span></button>)}</div><p className="notebook-mode-progress" role="status">{currentMode.label} layout</p></>
        : <p>{["One little studio, in your chosen mood.", "Press Save in the phone. Watch the response.", "", "Hover the pieces, or move the little note.", "References → decisions → a working interface.", "Guidance becomes useful when it meets a real task."][chapter]}</p>}
    </div>}
  </div>;
}
