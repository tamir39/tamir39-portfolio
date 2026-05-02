"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { findChannel } from "@/lib/data/nav";

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-3 left-3 border-l border-t",
    tr: "top-3 right-3 border-r border-t",
    bl: "bottom-3 left-3 border-l border-b",
    br: "bottom-3 right-3 border-r border-b",
  };
  return (
    <span
      aria-hidden
      className={`pointer-events-none fixed h-4 w-4 border-cyan ${map[position]}`}
    />
  );
}

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

export function HudFrame() {
  const pathname = usePathname();
  const channel = findChannel(pathname ?? "/");
  const time = useClock();

  return (
    <>
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[57] flex items-center justify-between px-6 py-3"
      >
        <span className="text-hud-label text-cyan">TAMIR.OS v1.0</span>
        <span className="text-hud-label text-text-dim">
          {time} <span className="text-cyan">UTC+7</span>
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[57] flex items-center justify-between px-6 py-3"
      >
        <span className="text-hud-label text-text-dim">
          // LAT 10.78°N · LON 106.66°E
        </span>
        <span className="text-hud-label text-cyan">
          CHANNEL :: {channel.id}
        </span>
      </div>
    </>
  );
}
