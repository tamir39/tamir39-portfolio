"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useBootStatus } from "@/components/providers/BootStatusProvider";

const LINES = [
  { prefix: ">", text: "initializing portfolio …", tone: "dim" as const },
  { prefix: ">", text: "loading projects … OK", tone: "dim" as const },
  { prefix: ">", text: "compiling skills … OK", tone: "dim" as const },
  { prefix: ">", text: "name: PHI VUONG TUONG TAM", tone: "primary" as const },
  { prefix: ">", text: "focus: FRONTEND · AI · GAMES", tone: "primary" as const },
  { prefix: ">", text: "location: HCMC, VIETNAM", tone: "primary" as const },
];

const CHAR_MS = 18;
const LINE_GAP_MS = 120;

type Frame = {
  lineIndex: number;
  charIndex: number;
};

export function Typewriter() {
  const reduced = usePrefersReducedMotion();
  const { isBooted } = useBootStatus();
  const [frame, setFrame] = useState<Frame>({ lineIndex: 0, charIndex: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isBooted) return;
    if (reduced) {
      setDone(true);
      return;
    }
    let cancelled = false;
    let timer: number | undefined;
    let li = 0;
    let ci = 0;

    const step = () => {
      if (cancelled) return;
      const line = LINES[li];
      if (!line) {
        setDone(true);
        return;
      }
      if (ci < line.text.length) {
        ci++;
        setFrame({ lineIndex: li, charIndex: ci });
        timer = window.setTimeout(step, CHAR_MS + Math.random() * 14);
      } else {
        li++;
        ci = 0;
        setFrame({ lineIndex: li, charIndex: 0 });
        timer = window.setTimeout(step, LINE_GAP_MS);
      }
    };

    timer = window.setTimeout(step, 250);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [isBooted, reduced]);

  return (
    <pre
      className="font-mono text-sm leading-relaxed text-text-dim"
      aria-hidden={!reduced && !done ? true : undefined}
      aria-label="System boot log"
    >
      {LINES.map((line, i) => {
        const isCurrent = !reduced && !done && i === frame.lineIndex;
        const visibleText = reduced || done
          ? line.text
          : i < frame.lineIndex
          ? line.text
          : isCurrent
          ? line.text.slice(0, frame.charIndex)
          : "";
        if (!visibleText && !isCurrent) return <span key={i} className="block opacity-0">·</span>;
        return (
          <span key={i} className="block">
            <span className="mr-2 text-cyan">{line.prefix}</span>
            <span className={line.tone === "primary" ? "text-text" : "text-text-dim"}>
              {visibleText}
            </span>
            {isCurrent ? (
              <span
                aria-hidden
                className="ml-1 inline-block h-3 w-2 -translate-y-px bg-cyan"
                style={{ animation: "blink 1s steps(1) infinite" }}
              />
            ) : null}
          </span>
        );
      })}
      {done && !reduced ? (
        <span
          aria-hidden
          className="mt-1 inline-block h-3 w-2 bg-cyan"
          style={{ animation: "blink 1s steps(1) infinite" }}
        />
      ) : null}
      <span className="sr-only" aria-live="polite">
        {done || reduced
          ? "Portfolio loaded. Phi Vuong Tuong Tam. Frontend, AI, and game development, based in Ho Chi Minh City, Vietnam."
          : ""}
      </span>
    </pre>
  );
}
