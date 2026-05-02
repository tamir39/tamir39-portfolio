"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants, reducedPageVariants } from "@/lib/motion/page-variants";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="enter"
      variants={reduced ? reducedPageVariants : pageVariants}
      style={{ transformOrigin: "center" }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
