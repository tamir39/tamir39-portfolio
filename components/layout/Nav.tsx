"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { channels } from "@/lib/data/nav";

export function Nav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="fixed left-0 top-1/2 z-[40] -translate-y-1/2 px-6"
    >
      <ul className="flex flex-col gap-3">
        {channels.map((c) => {
          const isActive =
            c.href === "/"
              ? pathname === "/"
              : pathname === c.href || pathname.startsWith(`${c.href}/`);
          return (
            <li key={c.id}>
              <Link
                href={c.href}
                data-cursor={`open ${c.label.toLowerCase()}`}
                aria-current={isActive ? "page" : undefined}
                className="group relative flex items-center gap-3 py-1 pr-4 transition-transform duration-200 hover:translate-x-1"
              >
                <span
                  aria-hidden
                  className={`block h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-cyan" : "bg-text-dim/50"
                  }`}
                  style={
                    isActive
                      ? { animation: "pulse-dot 1.4s ease-in-out infinite" }
                      : undefined
                  }
                />
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                    isActive ? "text-cyan" : "text-text-dim"
                  } group-hover:text-text`}
                >
                  {c.id}
                  <span className="ml-2 text-text-dim/60">— {c.label}</span>
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-5 h-px w-0 bg-violet transition-all duration-200 group-hover:w-[calc(100%-1.25rem)]"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
