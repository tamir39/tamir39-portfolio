"use client";

import { motion } from "framer-motion";

const bracketBase = "absolute h-3 w-3 border-cyan";

export function BioPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.5 }}
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
          Ho Chi Minh City who builds at the seam of code and play. I write
          Python and C# for game systems &mdash; A* searches, physics-driven
          survival loops &mdash; and ship product on Agile teams when the work
          calls for coordination over solo craft.
        </p>
        <p className="font-mono text-[13px] leading-[1.75] tracking-[0.01em] text-text-soft md:text-sm">
          <span className="text-cyan">$</span> Currently focused on game AI,
          real-time interaction, and the small set of details that make a
          thing feel alive instead of merely working.
        </p>
      </div>
    </motion.div>
  );
}
