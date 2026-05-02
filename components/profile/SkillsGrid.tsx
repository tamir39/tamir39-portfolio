"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data/skills";

export function SkillsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skillGroups.map((group) => (
        <motion.div
          key={group.category}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="flex flex-col gap-3"
        >
          <span className="text-hud-label text-cyan">▸ {group.category}</span>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="border border-stroke-bright bg-bg-elev/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft transition-colors duration-200 hover:border-violet hover:text-text"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
