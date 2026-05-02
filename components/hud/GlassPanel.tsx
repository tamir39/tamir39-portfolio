"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const bracketBase =
  "absolute h-3 w-3 border-cyan transition-opacity duration-300";

export function GlassPanel({
  children,
  className = "",
  brackets = true,
}: {
  children: ReactNode;
  className?: string;
  brackets?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-10%" }}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={`glass relative ${className}`}
    >
      {brackets && (
        <>
          <span className={`${bracketBase} -left-px -top-px border-l border-t`} />
          <span className={`${bracketBase} -right-px -top-px border-r border-t`} />
          <span className={`${bracketBase} -bottom-px -left-px border-b border-l`} />
          <span className={`${bracketBase} -bottom-px -right-px border-b border-r`} />
        </>
      )}
      {children}
    </motion.div>
  );
}
