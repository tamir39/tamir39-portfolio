"use client";

import { useState } from "react";
import Link from "next/link";
import { Accessibility, ArrowRight, ArrowUpRight, Check, Gauge, Paintbrush, ScanLine, SwatchBook } from "lucide-react";
import { designSkills } from "@/lib/design-skills";
import { InteractionDemo } from "./InteractionDemo";

const icons = [Paintbrush, SwatchBook, ScanLine, Gauge, Accessibility];

function HierarchyStudy() {
  const [refined, setRefined] = useState(true);
  return <div className="skill-hierarchy-study">
    <div className="skill-comparison" role="group" aria-label="Compare visual hierarchy">
      <button type="button" aria-pressed={!refined} onClick={() => setRefined(false)}>Starting point</button>
      <button type="button" aria-pressed={refined} onClick={() => setRefined(true)}>Considered hierarchy</button>
    </div>
    <div className={`skill-composition ${refined ? "is-refined" : ""}`}>
      <p className="skill-composition-kicker">A collection of little discoveries</p>
      <p className="skill-composition-title">Notice more.<br /><em>Make something.</em></p>
      <p className="skill-composition-copy">Ideas become interesting when you give them your own point of view.</p>
      <span className="skill-composition-rule" aria-hidden="true" />
      <p className="skill-composition-caption">Color · Type · Space</p>
    </div>
  </div>;
}

function RequestStudy() {
  const [parallel, setParallel] = useState(false);
  return <div className="skill-request-study">
    <div className="skill-comparison" role="group" aria-label="Compare request scheduling">
      <button type="button" aria-pressed={!parallel} onClick={() => setParallel(false)}>One after another</button>
      <button type="button" aria-pressed={parallel} onClick={() => setParallel(true)}>Start together</button>
    </div>
    <div className={`skill-request-chart ${parallel ? "is-parallel" : ""}`} role="img" aria-label={parallel ? "Profile, collection, and activity requests start together because they are independent." : "Profile, collection, and activity requests start one after another, creating a waterfall."}>
      <div className="skill-request-axis" aria-hidden="true"><span>Start</span><span>Time →</span></div>
      {["Profile", "Collection", "Activity"].map((label, index) => <div className="skill-request-row" key={label}><span>{label}</span><div className="skill-request-track"><span className={`skill-request-bar request-${index}`}><Check size={13} aria-hidden="true" /></span></div></div>)}
    </div>
    <p className="skill-request-explanation" role="status">{parallel ? "Three independent requests. One shared starting point." : "Each request waits for the previous one to finish."}</p>
  </div>;
}

export function SkillPractice() {
  const [selected, setSelected] = useState(0);
  const skill = designSkills[selected];
  return <div className="studio-skill-study">
    <div className="studio-skill-picker" role="group" aria-label="Explore design and frontend skills">
      {designSkills.map((item, index) => {
        const Icon = icons[index];
        return <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="skill-practice-study" onClick={() => setSelected(index)}><Icon size={18} aria-hidden="true" /><span><strong>{item.name}</strong><small>{item.focus}</small></span>{selected === index && <Check size={14} className="studio-skill-check" aria-hidden="true" />}</button>;
      })}
    </div>
    <article id="skill-practice-study" className="studio-workbench" aria-labelledby="exploration-study-heading">
      <div className="studio-preview">
        <div className="studio-preview-bar"><span><span className="studio-status-dot" />A principle in practice</span><span>0{selected + 1} / 05</span></div>
        <div className="studio-canvas skill-canvas">
          <div className="skill-principle"><p className="section-eyebrow">{skill.focus}</p><p className="skill-principle-title">{skill.principle}</p></div>
          <div className="skill-practice-demo" key={skill.id}>
            {skill.demo === "hierarchy" ? <HierarchyStudy /> : skill.demo === "requests" ? <RequestStudy /> : <div className="studio-demo-inner"><InteractionDemo index={skill.demo === "flow" ? 1 : skill.demo === "feedback" ? 0 : 2} /></div>}
          </div>
        </div>
        <div className="studio-preview-footer"><span>{skill.hint}</span><span aria-hidden="true">↗</span></div>
      </div>
      <div className="studio-notebook">
        <p className="section-eyebrow">Skills I’m exploring / {skill.author}</p><h3 id="exploration-study-heading">{skill.title}</h3>
        <div className="studio-note"><span>01</span><div><h4>What the guide covers</h4><p>{skill.description}</p></div></div>
        <div className="studio-note"><span>02</span><div><h4>How I’d put it to work</h4><p>{skill.application}</p></div></div>
        <div className="studio-sources"><h4>{skill.name}</h4><div><a href={skill.href} target="_blank" rel="noopener noreferrer">Read the original skill<ArrowUpRight size={13} aria-hidden="true" /></a></div><p className="studio-skill-attribution">AI skill guides by their original creators. The interactive studies here are my own interpretations.</p></div>
        <Link href={skill.project} className="studio-application"><span><small>Related work in my portfolio</small>{skill.example}</span><ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </article>
  </div>;
}
