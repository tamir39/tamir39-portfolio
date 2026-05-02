import type { Variants } from "framer-motion";

export const easeHud: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeHud },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: easeHud } },
};

export const stagger = (gap = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: gap, delayChildren: 0.05 },
  },
});

export const drawX: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left" },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: easeHud },
  },
};
