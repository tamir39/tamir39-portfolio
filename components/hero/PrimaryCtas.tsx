"use client";

import Link from "next/link";

type Cta = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
  cursor: string;
  variant: "cyan" | "violet";
};

const CTAS: Cta[] = [
  {
    label: "VIEW MISSIONS",
    href: "/missions",
    cursor: "view missions",
    variant: "cyan",
  },
  {
    label: "OPEN TRANSMISSION",
    href: "/transmission",
    cursor: "open transmission",
    variant: "cyan",
  },
  {
    label: "DOWNLOAD DOSSIER",
    href: "/PHIVUONGTUONGTAM_RESUME.pdf",
    download: true,
    cursor: "download resume",
    variant: "violet",
  },
];

export function PrimaryCtas() {
  return (
    <div className="flex flex-wrap gap-3">
      {CTAS.map((cta) => {
        const isViolet = cta.variant === "violet";
        const fillColor = isViolet ? "var(--color-violet)" : "var(--color-cyan)";
        const textColor = isViolet ? "text-violet" : "text-cyan";
        const borderColor = isViolet ? "border-violet" : "border-cyan";

        const inner = (
          <span
            className={`group relative inline-flex items-center justify-center overflow-hidden border ${borderColor} px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] ${textColor} transition-colors duration-200 hover:text-bg`}
            data-cursor={cta.cursor}
            style={{ minWidth: "11rem" }}
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
            <a
              key={cta.label}
              href={cta.href}
              download
              data-cursor={cta.cursor}
            >
              {inner}
            </a>
          );
        }

        return (
          <Link key={cta.label} href={cta.href} data-cursor={cta.cursor}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
