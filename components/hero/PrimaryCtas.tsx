"use client";

import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Cta = {
  label: string;
  href: string;
  download?: boolean;
  variant: "cyan" | "violet";
};

const CTAS: Cta[] = [
  {
    label: "VIEW WORK",
    href: "/#missions",
    variant: "cyan",
  },
  {
    label: "ABOUT ME",
    href: "/#profile",
    variant: "cyan",
  },
  {
    label: "DOWNLOAD CV",
    href: "/PHIVUONGTUONGTAM_RESUME.pdf",
    download: true,
    variant: "violet",
  },
];

export function PrimaryCtas() {
  const reduced = usePrefersReducedMotion();

  const handleAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    const id = href.slice(2);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {CTAS.map((cta) => {
        const isViolet = cta.variant === "violet";
        const fillColor = isViolet ? "var(--color-violet)" : "var(--color-cyan)";
        const textColor = isViolet ? "text-violet" : "text-cyan";
        const borderColor = isViolet ? "border-violet" : "border-cyan";

        const inner = (
          <span
            className={`group relative inline-flex w-full items-center justify-center overflow-hidden border ${borderColor} px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] ${textColor} transition-colors duration-200 hover:text-bg sm:w-auto sm:min-w-[11rem]`}
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
              style={{ background: fillColor }}
            />
            <span className="relative z-[1]">{`> ${cta.label}`}</span>
          </span>
        );

        if (cta.download) {
          return (
            <a key={cta.label} href={cta.href} download className="block w-full sm:w-auto">
              {inner}
            </a>
          );
        }

        return (
          <Link
            key={cta.label}
            href={cta.href}
            onClick={(e) => handleAnchor(e, cta.href)}
            className="block w-full sm:w-auto"
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
