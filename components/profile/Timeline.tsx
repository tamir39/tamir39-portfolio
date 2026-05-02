"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { education } from "@/lib/data/education";

export function Timeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative pl-10">
      <span className="absolute left-3 top-0 h-full w-px bg-stroke" aria-hidden />
      <motion.span
        aria-hidden
        className="absolute left-3 top-0 w-px bg-cyan"
        style={{
          height: lineHeight,
          boxShadow: "0 0 12px var(--color-cyan-soft)",
        }}
      />

      <ul className="flex flex-col gap-12">
        {education.map((entry, i) => (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], delay: i * 0.05 }}
            className="relative"
          >
            <span
              aria-hidden
              className="absolute -left-[1.875rem] top-1.5 h-3 w-3 rounded-full border border-cyan bg-bg"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-hud-label text-cyan">{entry.id} · {entry.span}</span>
              <h3 className="font-display text-xl text-text">{entry.school}</h3>
              {entry.highlight ? (
                <span className="text-hud-label text-violet">{entry.highlight}</span>
              ) : null}
              <p className="text-sm leading-relaxed text-text-dim">{entry.detail}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
