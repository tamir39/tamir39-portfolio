"use client";

import { useEffect, useRef, useState } from "react";
import { themes, type ThemeId } from "@/lib/themes";

function letters(text: string, offset: number, revealed: number) {
  let cursor = offset;
  return text.split(/(\s+)/).map((word, wordIndex) => {
    if (!word.trim()) { cursor += word.length; return word; }
    return <span className="hero-title-word" key={wordIndex}>{Array.from(word).map((letter, letterIndex) =>
      <span key={letterIndex} className="hero-title-letter" style={{ opacity: cursor++ < revealed ? 1 : 0 }}>{letter}</span>
    )}</span>;
  });
}

/** Keep every letter in the layout so revealing it never changes a line break. */
export function HeroHeading({ theme, reduced }: { theme: ThemeId; reduced: boolean }) {
  const current = themes.find(item => item.id === theme)!;
  const length = current.title.join(" ").length;
  const [revealed, setRevealed] = useState(reduced ? length : 0);
  const finished = useRef(reduced);

  useEffect(() => {
    if (reduced || document.hidden) { finished.current = true; setRevealed(length); return; }
    if (finished.current) return;
    let frame = 0, started = false;
    const root = document.documentElement;
    const observer = new MutationObserver(begin);
    function begin() {
      if (started || root.dataset.pageIntro !== "complete" || root.dataset.themeReveal === "true") return;
      started = true;
      observer.disconnect();
      const start = performance.now(), duration = Math.min(600, Math.max(360, length * 16));
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        setRevealed(Math.floor(progress * length));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finished.current = true;
      };
      frame = requestAnimationFrame(tick);
    }
    const finish = () => { if (document.hidden) { finished.current = true; observer.disconnect(); cancelAnimationFrame(frame); setRevealed(length); } };
    observer.observe(root, { attributes: true, attributeFilter: ["data-page-intro", "data-theme-reveal"] });
    document.addEventListener("visibilitychange", finish);
    begin();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", finish); };
  }, [length, reduced]);

  const complete = reduced || revealed >= length;
  return <h1 className="hero-title" data-hero-theme={theme} data-hero-reveal={complete ? "complete" : revealed ? "typing" : "waiting"} aria-label={current.title.join(" ")}>
    {current.title.map((line, index) => <span key={index} data-hero-line className={index ? "hero-title-accent" : undefined} aria-hidden="true">
      {letters(line, index ? current.title[0].length + 1 : 0, reduced ? length : revealed)}
    </span>)}
    <span className="hero-title-samples" aria-hidden="true">{themes.map(sample => <span key={sample.id} className="hero-title hero-title-sample" data-hero-theme={sample.id}>
      <span>{letters(sample.title[0], 0, Infinity)}</span><span className="hero-title-accent">{letters(sample.title[1], 0, Infinity)}</span>
    </span>)}</span>
  </h1>;
}
