"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Fingerprint, Lightbulb, PenTool, Sparkles } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { themes } from "@/lib/themes";

export const practiceSteps = [
  { name: "Learn", icon: Lightbulb, title: "Keep the principle.", copy: "Understand why the pattern works. Hierarchy, contrast, and feedback give the idea a foundation." },
  { name: "Choose", icon: PenTool, title: "Choose what belongs.", copy: "Keep what helps the experience. Shape the type, rhythm, and response around the idea." },
  { name: "Own it", icon: Fingerprint, title: "Leave your mark.", copy: "Bring the decisions together until the result feels intentional, distinctive, and your own." },
] as const;

/** The last chapter turns shared principles into a visible point of view. */
export function MakeItYoursStudy({ stage = 2, scrollDriven = false }: { stage?: number; scrollDriven?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: .25, once: true });
  const { theme, reduced } = usePortfolioTheme();
  const currentStage = Math.max(0, Math.min(practiceSteps.length - 1, stage));
  const current = themes.find(item => item.id === theme)!;
  return <div ref={root} className="practice-study" data-stage={currentStage} data-scroll-driven={scrollDriven} data-live={visible && !reduced} data-theme-cycle-ignore>
    <div className="practice-topline"><span>From a principle to a point of view.</span><span>0{currentStage + 1} / 03</span></div>
    <div className="practice-scene" aria-hidden="true">
      <div className="practice-orbit"><i /><i /></div>
      <div className="practice-source"><small>THE STARTING POINT</small><span>Aa</span><p>Hierarchy.<br />Contrast.<br />A clear response.</p></div>
      <div className="practice-poster">
        <div className="practice-poster-header"><span>T / Studio</span><ArrowUpRight size={13} /></div>
        <div className="practice-poster-art"><svg viewBox="0 0 220 130"><circle cx="110" cy="65" r="52" /><circle cx="110" cy="65" r="37" /><path d="M0 65H220 M110 0V130 M30 15L190 115 M190 15L30 115" /></svg><span>{current.symbol}</span><i /><i /></div>
        <div className="practice-poster-type"><small>{currentStage === 0 ? "A SHARED FOUNDATION" : currentStage === 1 ? "A CONSIDERED DIRECTION" : "A SIGNATURE OF YOUR OWN"}</small><p>{currentStage === 0 ? <>An idea.<br /><em>A beginning.</em></> : currentStage === 1 ? <>Find your<br /><em>point of view.</em></> : <>Make it<br /><em>yours.</em></>}</p></div>
        <div className="practice-poster-footer"><span>Type. Space. Feeling.</span><span>06 / {current.name}</span></div>
        <span className="practice-selection selection-top" /><span className="practice-selection selection-bottom" />
      </div>
      <div className="practice-choice"><PenTool size={13} /><span>A decision, not a default.</span></div>
      <div className="practice-signature"><Fingerprint size={19} /><span>Made with<br /><strong>intent.</strong></span></div>
      <span className="practice-spark"><Sparkles size={20} /></span>
    </div>
    <p className="practice-caption" role={scrollDriven ? "status" : undefined} aria-live={scrollDriven ? "polite" : undefined}>{["Principles are the starting point.", "The choices are what make the difference.", "A point of view, made visible."][currentStage]}</p>
    <ol className="practice-progress" aria-label="From learning to a signature">{practiceSteps.map((step, number) => <li key={step.name} data-reached={number <= currentStage} aria-current={scrollDriven && number === currentStage ? "step" : undefined}><span>0{number + 1}</span>{step.name}</li>)}</ol>
  </div>;
}
