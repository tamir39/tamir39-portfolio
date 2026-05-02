import type { Variants } from "framer-motion";
import { easeHud } from "./variants";

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scaleY: 0.06,
  },
  enter: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.32,
      ease: easeHud,
      opacity: { duration: 0.22, delay: 0.06 },
      scaleY: { duration: 0.32, ease: easeHud },
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0.06,
    transition: {
      duration: 0.22,
      ease: easeHud,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
