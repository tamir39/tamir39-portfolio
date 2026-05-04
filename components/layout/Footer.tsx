"use client";

import { usePathname } from "next/navigation";
import { useActiveSection } from "@/components/providers/ActiveSectionProvider";
import { findChannel, findChannelByPath } from "@/lib/data/nav";

export function Footer() {
  const pathname = usePathname() ?? "/";
  const active = useActiveSection();
  const channel = findChannelByPath(pathname) ?? findChannel(active);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[58] border-t border-stroke-bright/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5 md:px-10">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim">
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rounded-full bg-cyan"
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              boxShadow: "0 0 8px var(--color-cyan)",
            }}
          />
          ONLINE · © 2026 TAMIR39
        </span>

        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim md:flex">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=tamphi5002@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan"
          >
            tamphi5002@gmail.com
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a
            href="tel:+84938419071"
            className="transition-colors hover:text-cyan"
          >
            +84 938 419 071
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a
            href="https://github.com/tamir39"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan"
          >
            github.com/tamir39
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a
            href="https://www.linkedin.com/in/t%C3%A2m-ph%C3%AD-v%C6%B0%C6%A1ng-t%C6%B0%E1%BB%9Dng-686919388/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan"
          >
            linkedin
          </a>
        </div>

        <span className="text-glow-cyan font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
          {channel.channelId} · {channel.label}
        </span>
      </div>
    </footer>
  );
}
