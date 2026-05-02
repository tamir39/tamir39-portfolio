"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";

export function MissionBody({ project }: { project: Project }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
      }}
      className="flex flex-col gap-8"
    >
      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="flex flex-col gap-3"
      >
        <span className="text-hud-label text-cyan">▸ SUMMARY</span>
        <p className="max-w-3xl text-base leading-relaxed text-text md:text-lg">
          {project.summary}
        </p>
      </motion.section>

      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="flex flex-col gap-4"
      >
        <span className="text-hud-label text-cyan">▸ HIGHLIGHTS</span>
        <ul className="flex flex-col gap-3">
          {project.highlights.map((h, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              className="flex gap-3 text-base leading-relaxed text-text-soft"
            >
              <span
                aria-hidden
                className="text-glow-cyan shrink-0 font-mono text-cyan"
                style={{ lineHeight: "1.6" }}
              >
                ▸
              </span>
              <span>{h}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}
