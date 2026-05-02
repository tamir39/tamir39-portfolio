"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AvatarPortrait() {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      className="relative aspect-square w-[260px] md:w-[340px]"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 1px var(--color-violet), 0 0 60px var(--color-violet-soft)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 1, 0.85, 1] }}
        transition={{ duration: 0.9, times: [0, 0.4, 0.45, 0.6, 1], delay: 0.3 }}
      />
      <Image
        src="/tamir-avatar.png"
        alt="Tamir39 avatar — cybercat with circuit lines"
        width={680}
        height={680}
        priority
        className="relative z-[1] h-full w-full rounded-full object-cover"
      />
    </motion.div>
  );
}
