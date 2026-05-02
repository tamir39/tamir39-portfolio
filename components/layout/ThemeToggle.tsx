"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to day ops" : "Switch to night ops"}
      title={isDark ? "DAY OPS" : "NIGHT OPS"}
      className="group relative flex h-8 w-8 shrink-0 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
    >
      {isDark ? (
        <Sun size={14} strokeWidth={1.5} />
      ) : (
        <Moon size={14} strokeWidth={1.5} />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.3em] text-cyan opacity-0 transition-opacity group-hover:opacity-100"
      >
        {isDark ? "DAY" : "NIGHT"}
      </span>
    </button>
  );
}
