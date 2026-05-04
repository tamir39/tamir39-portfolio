"use client";

import { motion } from "framer-motion";

const bracketBase = "absolute h-3 w-3 border-cyan";

export function BioPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.32 }}
      className="glass-strong relative px-6 py-5"
    >
      <span className={`${bracketBase} -left-px -top-px border-l border-t`} />
      <span className={`${bracketBase} -right-px -top-px border-r border-t`} />
      <span className={`${bracketBase} -bottom-px -left-px border-b border-l`} />
      <span className={`${bracketBase} -bottom-px -right-px border-b border-r`} />

      <div className="flex flex-col gap-4">
        <span className="text-hud-label text-cyan">▸ BIOGRAPHY</span>
        <p className="font-mono text-[13px] leading-[1.75] tracking-[0.01em] text-text md:text-sm">
          <span className="text-cyan">$</span> A computer-science undergrad in
          Ho Chi Minh City who builds across three fronts &mdash;{" "}
          <span className="text-cyan">frontend</span>,{" "}
          <span className="text-cyan">AI/ML</span>, and{" "}
          <span className="text-cyan">games</span>. I like the seam where code
          meets play: A* searches, physics loops, RAG agents, and 3D scenes
          that feel alive instead of merely rendering.
        </p>
        <p className="font-mono text-[13px] leading-[1.75] tracking-[0.01em] text-text-soft md:text-sm">
          <span className="text-cyan">$</span> Now building the frontend for{" "}
          <span className="text-text">100B Studio</span> (my startup), plus{" "}
          <span className="text-text">Mono Desk</span>,{" "}
          <span className="text-text">Zuno</span>, and a stack of report-grade
          projects. Hackathon team for{" "}
          <span className="text-text">Panic Hub</span> &mdash; multi-agent
          economic crisis simulator at GDG OC Hackathon 2026.
        </p>
        <div className="flex flex-col gap-2 border border-cyan/30 bg-cyan/[0.04] px-3 py-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-cyan">
            // STATUS :: AVAILABLE_FOR
          </span>
          <p className="font-mono text-[12px] leading-[1.6] tracking-[0.01em] text-text">
            Junior 3D frontend &middot; game design &middot; web-app design
            &middot; open to <span className="text-cyan">freelance</span> and{" "}
            <span className="text-cyan">startup-team</span> roles.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
