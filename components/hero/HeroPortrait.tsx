"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useBootStatus } from "@/components/providers/BootStatusProvider";

export function HeroPortrait() {
  const { isBooted } = useBootStatus();

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={isBooted ? { scale: 1, opacity: 1 } : { scale: 0.94, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
      className="relative aspect-square w-[260px] md:w-[340px]"
      style={{ willChange: "transform" }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 1px var(--color-violet), 0 0 60px var(--color-violet-soft)",
        }}
        initial={{ opacity: 0 }}
        animate={isBooted ? { opacity: [0, 0.2, 1, 0.85, 1] } : { opacity: 0 }}
        transition={{
          duration: 0.6,
          times: [0, 0.35, 0.45, 0.65, 1],
          delay: 0.15,
        }}
      />

      <div
        className="relative z-[1] h-full w-full overflow-hidden rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px var(--color-cyan-soft), inset 0 0 28px rgba(0,229,255,0.18)",
          animation: isBooted ? "avatar-breath 5s ease-in-out infinite" : undefined,
        }}
      >
        <Image
          src="/tamir-avatar.png"
          alt="Tamir cybercat avatar"
          fill
          priority
          sizes="(min-width: 768px) 340px, 260px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
