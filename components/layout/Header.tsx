"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Phone, Github } from "lucide-react";

function useClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const utc = d.getTime() + d.getTimezoneOffset() * 60_000;
      const hcm = new Date(utc + 7 * 60 * 60_000);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(hcm.getHours())}:${pad(hcm.getMinutes())}:${pad(hcm.getSeconds())}`;
    };
    setNow(fmt());
    const id = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const ICON_LINKS = [
  { Icon: Mail, href: "mailto:tamphi5002@gmail.com", label: "Email" },
  { Icon: Phone, href: "tel:+84938419071", label: "Phone" },
  { Icon: Github, href: "https://github.com/tamir39", label: "GitHub" },
];

export function Header() {
  const time = useClock();

  return (
    <header className="fixed inset-x-0 top-0 z-[58] border-b border-stroke-bright/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5 md:px-10">
        <Link
          href="/"
          aria-label="Tamir home"
          className="group flex items-center gap-3"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-cyan/50 bg-bg-elev transition-colors group-hover:border-cyan">
            <Image src="/tamir-avatar.png" alt="" fill sizes="28px" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-glow-cyan font-display text-sm font-semibold tracking-[0.22em]">
              TAMIR
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-text-dim">
              portfolio · v1.0
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {ICON_LINKS.map(({ Icon, href, label }) => {
            const external = href.startsWith("http");
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group relative flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
              >
                <Icon size={14} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim md:inline">
            {time} <span className="text-cyan">UTC+7</span>
          </span>
          <a
            href="/PHIVUONGTUONGTAM_RESUME.pdf"
            download
            aria-label="Download dossier"
            className="group relative inline-flex items-center gap-2 overflow-hidden border-[1.5px] border-cyan px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan transition-colors duration-200 hover:text-bg"
            style={{ boxShadow: "0 0 12px var(--color-cyan-soft)" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1]">{"> DOSSIER"}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
