"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/hud/GlassPanel";

type Channel = {
  label: string;
  value: string;
  href: string;
  copy?: string;
};

const CHANNELS: Channel[] = [
  {
    label: "MAIL",
    value: "tamphi5002@gmail.com",
    href: "mailto:tamphi5002@gmail.com",
    copy: "tamphi5002@gmail.com",
  },
  {
    label: "VOICE",
    value: "+84 938 419 0711",
    href: "tel:+84938419071",
    copy: "+84938419071",
  },
  {
    label: "GITHUB",
    value: "github.com/tamir39",
    href: "https://github.com/tamir39",
  },
];

export function ContactCard() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (channel: Channel) => {
    if (!channel.copy) return;
    try {
      await navigator.clipboard.writeText(channel.copy);
      setCopied(channel.label);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <GlassPanel className="px-6 py-5">
      <div className="flex flex-col gap-5">
        <span className="text-hud-label text-cyan">// CHANNELS</span>
        <ul className="flex flex-col gap-3">
          {CHANNELS.map((ch) => (
            <li
              key={ch.label}
              className="flex items-center justify-between gap-3 border-b border-stroke pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <span className="text-hud-label text-text-dim">{ch.label}</span>
                <a
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-cursor={`open ${ch.label.toLowerCase()}`}
                  className="font-mono text-sm text-text transition-colors hover:text-cyan"
                >
                  {ch.value}
                </a>
              </div>
              {ch.copy ? (
                <button
                  type="button"
                  onClick={() => handleCopy(ch)}
                  data-cursor="copy"
                  className="border border-stroke px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim transition-colors hover:border-cyan hover:text-cyan"
                  aria-label={`Copy ${ch.label.toLowerCase()}`}
                >
                  {copied === ch.label ? "// COPIED" : "COPY"}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
