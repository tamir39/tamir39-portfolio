"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  channel,
  title,
}: {
  channel: string;
  title: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="relative flex flex-col gap-3"
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, x: -8 },
          visible: { opacity: 1, x: 0 },
        }}
        className="text-hud-label text-cyan"
      >
        {`▸ ${channel}`}
      </motion.span>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-glow-cyan font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
      >
        {title}
      </motion.h2>
      <motion.span
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          visible: {
            scaleX: 1,
            transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] },
          },
        }}
        style={{ transformOrigin: "left" }}
        className="block h-px w-44 bg-cyan"
      />
      <span aria-hidden className="divider-cyan absolute -bottom-2 left-0 right-0 opacity-50" />
    </motion.header>
  );
}
