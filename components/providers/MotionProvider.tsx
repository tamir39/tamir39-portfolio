"use client";

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.65, 0, 0.35, 1] }}>
      {children}
    </MotionConfig>
  );
}
