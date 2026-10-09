"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Check, Code2, Layers, Lightbulb, Sparkles } from "lucide-react";
import { usePortfolioMotion } from "./providers/ThemeProvider";

export const workflowStages = [
  { name: "Idea", icon: Lightbulb, title: "Find the reason to build.", copy: "Start with a purpose. Collect a feeling, then choose a direction." },
  { name: "Structure", icon: Layers, title: "Make the next step obvious.", copy: "Give the content a hierarchy and the action a clear place to live." },
  { name: "Build", icon: Code2, title: "Bring the decisions to life.", copy: "Turn the structure into a real interface, with reusable pieces." },
  { name: "Refine", icon: Sparkles, title: "Make the details earn their place.", copy: "Tune the spacing, type, and feedback by using what you built." },
] as const;

/** A single composition evolves instead of replacing the process with labels. */
export function WorkflowStudy({ stage = 3, scrollDriven = false }: { stage?: number; scrollDriven?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: .25 });
  const { reduced } = usePortfolioMotion();
  const currentStage = Math.max(0, Math.min(workflowStages.length - 1, stage));
  const current = workflowStages[currentStage];
  return <div ref={root} className="workflow-study" data-stage={currentStage} data-scroll-driven={scrollDriven} data-live={visible && !reduced} data-theme-cycle-ignore>
    <div className="workflow-topline"><span>One idea. Four decisions.</span><span>0{currentStage + 1} / 04</span></div>
    <div className="workflow-scene" aria-hidden="true">
      <div className="workflow-guides"><i /><i /><i /></div>
      <div className="workflow-browser">
        <div className="workflow-browser-bar"><span><i /><i /><i /></span><small>studio / {current.name.toLowerCase()}</small><ArrowUpRight size={12} /></div>
        <div className="workflow-interface">
          <div className="workflow-nav"><span>T / Studio</span><span>✳</span></div>
          <div className="workflow-interface-body">
            <div className="workflow-interface-copy"><small>A LITTLE SPACE FOR IDEAS</small><p>Make room<br /><em>for curiosity.</em></p><span>Keep what inspires you.<br />Make something of your own.</span></div>
            <div className="workflow-art"><i /><i /><span>✳</span><svg viewBox="0 0 100 100"><path d="M0 0 100 100 M100 0 0 100" /></svg></div>
          </div>
          <div className="workflow-interface-bottom"><div><span>Design</span><span>Feeling</span><span>Discovery</span></div><div className="workflow-save">{currentStage === 3 ? <><Check size={13} /><span>Idea saved</span></> : <><span>Save this idea</span><ArrowUpRight size={12} /></>}</div></div>
          <span className="workflow-wire wire-title" /><span className="workflow-wire wire-copy" /><span className="workflow-wire wire-action" />
        </div>
      </div>
      <div className="workflow-reference workflow-reference-type"><small>01 / TYPE</small><strong>Aa.</strong><span>A little character.</span></div>
      <div className="workflow-reference workflow-reference-color"><small>02 / FEELING</small><div><i /><i /><i /></div><span>Find a point of view.</span></div>
      <div className="workflow-reference workflow-reference-intent"><Lightbulb size={17} /><p>A place to keep<br />what inspires you.</p><span>The idea comes first.</span></div>
      <div className="workflow-build-note"><Code2 size={13} /><code>&lt;IdeaCard /&gt;</code><span>design → code</span></div>
      <div className="workflow-refine-note"><Check size={13} /><span>Every detail, considered.</span></div>
      <span className="workflow-spacing">24px</span>
    </div>
    <div className="workflow-decision" role={scrollDriven ? "status" : undefined} aria-live={scrollDriven ? "polite" : undefined} aria-atomic="true"><strong>{current.title}</strong><p>{current.copy}</p></div>
    <ol className="workflow-steps" aria-label="Design workflow progress">{workflowStages.map((item, index) => <li key={item.name} data-reached={index <= currentStage} aria-current={scrollDriven && currentStage === index ? "step" : undefined}><small>0{index + 1}</small><span>{item.name}</span></li>)}</ol>
  </div>;
}
