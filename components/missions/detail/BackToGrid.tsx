"use client";

import Link from "next/link";

export function BackToGrid() {
  return (
    <Link
      href="/#projects"
      className="group relative inline-flex items-center gap-2 self-start overflow-hidden border border-[#D7E2EA]/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#D7E2EA]/70 transition-colors duration-200 hover:text-[#D7E2EA] hover:border-[#D7E2EA]"
    >
      <span>← Back to projects</span>
    </Link>
  );
}
