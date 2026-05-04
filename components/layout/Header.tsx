"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Github, Linkedin, Copy, Check } from "lucide-react";
import { channels } from "@/lib/data/nav";
import { useActiveSection } from "@/components/providers/ActiveSectionProvider";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

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

const PHONE_DISPLAY = "+84 938 419 071";
const PHONE_TEL = "+84938419071";
const EMAIL = "tamphi5002@gmail.com";
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

const SOCIAL_LINKS = [
  { Icon: Github, href: "https://github.com/tamir39", label: "GitHub" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/t%C3%A2m-ph%C3%AD-v%C6%B0%C6%A1ng-t%C6%B0%E1%BB%9Dng-686919388/",
    label: "LinkedIn",
  },
];

function PhoneButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Phone"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group relative flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
      >
        <Phone size={14} strokeWidth={1.5} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Phone number"
          className="glass-strong absolute right-0 top-[calc(100%+8px)] z-[60] flex min-w-[220px] flex-col gap-2 border border-cyan/40 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ boxShadow: "0 0 16px var(--color-cyan-soft)" }}
        >
          <span className="text-[9px] tracking-[0.24em] text-text-dim">
            Phone
          </span>
          <span className="text-glow-cyan text-sm tracking-[0.2em] text-cyan">
            {PHONE_DISPLAY}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex flex-1 items-center justify-center gap-1.5 border border-cyan/50 px-2 py-1 text-[10px] tracking-[0.22em] text-cyan transition-colors hover:bg-cyan/10"
            >
              <Phone size={11} strokeWidth={1.5} /> Call
            </a>
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center justify-center gap-1.5 border border-stroke px-2 py-1 text-[10px] tracking-[0.22em] text-text-dim transition-colors hover:border-cyan hover:text-cyan"
              aria-label="Copy phone number"
            >
              {copied ? (
                <>
                  <Check size={11} strokeWidth={1.5} /> Copied
                </>
              ) : (
                <>
                  <Copy size={11} strokeWidth={1.5} /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const time = useClock();
  const pathname = usePathname() ?? "/";
  const active = useActiveSection();
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();
  const avatarSrc =
    theme === "light"
      ? "/tamir-avatar-lightmode.png"
      : "/tamir-avatar-darkmode.png";

  const onDetail = pathname.startsWith("/missions/");
  const effectiveActive = onDetail ? "missions" : active;

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", id === "hero" ? "/" : `/#${id}`);
      }
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[58] border-b border-stroke-bright/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 md:px-10">
        <Link
          href="/"
          aria-label="Tamir home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-cyan/50 bg-bg-elev transition-colors group-hover:border-cyan">
            <Image key={avatarSrc} src={avatarSrc} alt="" fill sizes="28px" />
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

        <nav
          aria-label="Channels"
          className="hidden flex-1 items-center justify-center gap-5 md:flex lg:gap-7"
        >
          {channels.map((c) => {
            const isActive = c.id === effectiveActive;
            return (
              <Link
                key={c.id}
                href={c.id === "hero" ? "/" : `/#${c.id}`}
                onClick={(e) => handleNav(e, c.id)}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex items-center gap-2 py-1"
              >
                <span
                  aria-hidden
                  className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? "bg-cyan" : "bg-text-dim/40"
                  }`}
                  style={
                    isActive
                      ? {
                          animation: "pulse-dot 1.4s ease-in-out infinite",
                          boxShadow: "0 0 6px var(--color-cyan)",
                        }
                      : undefined
                  }
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                    isActive
                      ? "text-glow-cyan text-cyan"
                      : "text-text-dim group-hover:text-text"
                  }`}
                >
                  {c.channelId}
                  <span
                    className={`ml-1.5 ${
                      isActive ? "text-cyan/70" : "text-text-dim/60"
                    } hidden lg:inline`}
                  >
                    · {c.label}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`absolute -bottom-[3px] left-0 h-px bg-cyan transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  style={isActive ? { boxShadow: "0 0 6px var(--color-cyan)" } : undefined}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={GMAIL_COMPOSE}
              aria-label="Email"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
            >
              <Mail size={14} strokeWidth={1.5} />
            </a>
            <PhoneButton />
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-8 w-8 items-center justify-center border border-stroke text-text-dim transition-colors hover:border-cyan hover:text-cyan"
              >
                <Icon size={14} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <ThemeToggle />

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim xl:inline">
            {time} <span className="text-cyan">UTC+7</span>
          </span>

          <a
            href="/PHIVUONGTUONGTAM_RESUME.pdf"
            download
            aria-label="Download CV"
            className="group relative inline-flex items-center gap-2 overflow-hidden border-[1.5px] border-cyan px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan transition-colors duration-200 hover:text-bg"
            style={{ boxShadow: "0 0 12px var(--color-cyan-soft)" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1]">{"> CV"}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
