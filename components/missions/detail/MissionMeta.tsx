"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { TechTag } from "../TechTag";

const Row = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col gap-1"
  >
    <span className="text-hud-label text-text-dim">{label}</span>
    <span className="font-mono text-sm text-text">{value}</span>
  </motion.div>
);

export function MissionMeta({ project }: { project: Project }) {
  return (
    <aside
      aria-label="Mission metadata"
      className="glass-strong relative flex flex-col gap-5 px-5 py-5"
    >
      <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan" />
      <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-cyan" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-cyan" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan" />

      <span className="text-hud-label text-cyan">▸ Details</span>
      <Row label="Role" value={project.role} />
      <Row label="Timeline" value={project.dates} />
      <div className="flex flex-col gap-2">
        <span className="text-hud-label text-text-dim">Stack</span>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <TechTag key={s}>{s}</TechTag>
          ))}
        </div>
      </div>
      {project.links && project.links.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-hud-label text-text-dim">Links</span>
          <div className="flex flex-wrap gap-1.5">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-cyan/40 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan transition-colors hover:border-cyan hover:bg-cyan/10"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
