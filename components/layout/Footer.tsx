"use client";

import { usePathname } from "next/navigation";
import { Mail, Phone, Github, Linkedin } from "lucide-react";
import { useActiveSection } from "@/components/providers/ActiveSectionProvider";
import { findChannel, findChannelByPath } from "@/lib/data/nav";

const EMAIL = "tamphi5002@gmail.com";
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
const PHONE_TEL = "+84938419071";
const GH = "https://github.com/tamir39";
const LI =
  "https://www.linkedin.com/in/t%C3%A2m-ph%C3%AD-v%C6%B0%C6%A1ng-t%C6%B0%E1%BB%9Dng-686919388/";

export function Footer() {
  const pathname = usePathname() ?? "/";
  const active = useActiveSection();
  const channel = findChannelByPath(pathname) ?? findChannel(active);

  return (
    <footer className="relative z-[2] mt-16 border-t border-stroke-bright/40 bg-bg/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 md:flex-row md:gap-3 md:px-10 md:py-4">
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

        {/* Mobile contact icons (under sm only) */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={GMAIL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            <Mail size={14} strokeWidth={1.5} />
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            aria-label="Call"
            className="flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            <Phone size={14} strokeWidth={1.5} />
          </a>
          <a
            href={GH}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            <Github size={14} strokeWidth={1.5} />
          </a>
          <a
            href={LI}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            <Linkedin size={14} strokeWidth={1.5} />
          </a>
        </div>

        {/* Desktop inline contact list (md+) */}
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim md:flex">
          <a href={GMAIL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan">
            {EMAIL}
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-cyan">
            +84 938 419 071
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a href={GH} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan">
            github.com/tamir39
          </a>
          <span aria-hidden className="h-3 w-px bg-stroke" />
          <a href={LI} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan">
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
