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
      className="flex flex-col gap-3"
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, x: -8 },
          visible: { opacity: 1, x: 0 },
        }}
        className="text-hud-label text-cyan"
      >
        {`// ${channel}`}
      </motion.span>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0 },
        }}
        className="font-display text-3xl font-semibold tracking-wide md:text-4xl"
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
        className="block h-px w-32 bg-cyan"
      />
    </motion.header>
  );
}
