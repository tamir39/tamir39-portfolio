"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { StatusPill } from "../StatusPill";

export function MissionHeader({ project }: { project: Project }) {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
      className="flex flex-col gap-4"
    >
      <motion.div
        variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
        className="flex items-center gap-3"
      >
        <span className="text-hud-label text-cyan text-glow-cyan">{project.id}</span>
        <span className="h-px flex-1 bg-stroke-bright" />
        <StatusPill status={project.status} />
      </motion.div>
      <motion.h1
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        className="text-glow-cyan font-display text-3xl font-semibold leading-tight tracking-tight break-words sm:text-4xl md:text-6xl"
      >
        {project.name}
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        className="max-w-2xl text-base leading-relaxed text-text-soft md:text-lg"
      >
        {project.tagline}
      </motion.p>
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        style={{ transformOrigin: "left" }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="block h-px w-44 bg-cyan"
      />
    </motion.header>
  );
}
