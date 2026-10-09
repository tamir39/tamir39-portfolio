"use client";

import { Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioMotion } from "./providers/ThemeProvider";

export function StudioInterface({ saved, onSave, saveHintId }: { saved: boolean; onSave: () => void; saveHintId?: string }) {
  const { reduced } = usePortfolioMotion();
  return <div className="studio-interface">
    <div className="journey-phone-nav"><span>T / Studio</span><span aria-hidden="true">✳</span></div>
    <div className="studio-interface-body">
      <div className="journey-phone-art" aria-hidden="true"><i /><i /><span>✳</span></div>
      <div className="studio-interface-copy"><p className="journey-phone-kicker">A LITTLE SPACE FOR IDEAS</p>
        <p className="journey-phone-title">Make room<br /><em>for curiosity.</em></p>
        <p className="journey-phone-copy">Keep what inspires you.<br />Make something of your own.</p>
        <div className="journey-phone-tags"><span>Design</span><span>Feeling</span><span>Discovery</span></div>
        <motion.button type="button" aria-pressed={saved} aria-describedby={saveHintId} className="journey-save theme-button" onClick={onSave} whileTap={reduced ? undefined : { scale: .96 }}><motion.span key={String(saved)} initial={reduced ? false : { scale: .5, rotate: -18 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 360, damping: 18 }}>{saved ? <Check size={17} aria-hidden="true" /> : <Heart size={17} aria-hidden="true" />}</motion.span><span>{saved ? "Idea saved" : "Save this idea"}</span></motion.button>
        <p className="journey-phone-feedback" role="status">{saved ? "A little inspiration, kept for later." : "Try a little interaction."}</p>
      </div>
    </div>
  </div>;
}
