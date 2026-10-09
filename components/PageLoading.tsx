"use client";

import { useState } from "react";
import { BrandScene } from "./BrandScene";
import { usePortfolioMotion } from "./providers/ThemeProvider";

export function PageLoading() {
  const { reduced } = usePortfolioMotion();
  const [paused, setPaused] = useState(false);
  return <div className="page-loading" data-theme-cycle-ignore>
    <BrandScene loading={!paused} variant="loading" />
    <span className="sr-only" role="status">Loading page…</span>
    {!reduced && <button type="button" className="page-intro-skip page-loader-pause" onClick={() => setPaused(value => !value)}>{paused ? "Resume animation" : "Pause animation"}</button>}
  </div>;
}
