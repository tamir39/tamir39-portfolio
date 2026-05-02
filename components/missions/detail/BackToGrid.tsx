"use client";

import Link from "next/link";

export function BackToGrid() {
  return (
    <Link
      href="/#missions"
      data-cursor="return to archive"
      className="group relative inline-flex items-center gap-2 self-start overflow-hidden border border-cyan px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan transition-colors duration-200 hover:text-bg"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-right scale-x-0 bg-cyan transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      />
      <span className="relative z-[1]">{"< RETURN TO ARCHIVE"}</span>
    </Link>
  );
}
