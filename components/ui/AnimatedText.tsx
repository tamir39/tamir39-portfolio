"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");

  if (reduced) {
    return <p className={className} style={style}>{text}</p>;
  }

  return (
    <p ref={containerRef} className={className} style={style} aria-label={text}>
      {words.map((word, wi) => {
        const wordStart = wi / words.length;
        const wordEnd = Math.min(1, (wi + 1) / words.length + 0.1);
        return (
          <WordSpan
            key={wi}
            word={word}
            scrollYProgress={scrollYProgress}
            start={wordStart}
            end={wordEnd}
            isLast={wi === words.length - 1}
          />
        );
      })}
    </p>
  );
}

function WordSpan({
  word,
  scrollYProgress,
  start,
  end,
  isLast,
}: {
  word: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
  isLast: boolean;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <>
      <motion.span
        style={{ opacity }}
        className="inline-block"
      >
        {word}
      </motion.span>
      {!isLast && <span> </span>}
    </>
  );
}
