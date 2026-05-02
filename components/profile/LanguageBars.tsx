"use client";

import { motion } from "framer-motion";
import { languages } from "@/lib/data/skills";

export function LanguageBars() {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-hud-label text-cyan">▸ LANGUAGES</span>
      <ul className="flex flex-col gap-3">
        {languages.map((lang) => (
          <li key={lang.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm text-text">{lang.name}</span>
              <span className="text-hud-label text-violet">{lang.label}</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden bg-stroke-bright">
              <motion.span
                className="absolute inset-y-0 left-0 bg-cyan"
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.level}%` }}
                viewport={{ once: false, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                style={{ boxShadow: "0 0 6px var(--color-cyan)" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
