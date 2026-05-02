import type { Variants } from "framer-motion";
import { easeHud } from "./variants";

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scaleY: 0.04,
    filter: "blur(2px)",
  },
  enter: {
    opacity: 1,
    scaleY: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: easeHud,
      opacity: { duration: 0.4, delay: 0.15 },
      scaleY: { duration: 0.55, ease: easeHud },
      filter: { duration: 0.4, delay: 0.15 },
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0.04,
    filter: "blur(2px)",
    transition: {
      duration: 0.4,
      ease: easeHud,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
