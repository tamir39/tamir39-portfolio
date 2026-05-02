"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function VideoFrame() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "100px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="relative aspect-video w-full overflow-hidden bg-bg-elev"
        style={{
          boxShadow: "0 0 0 1px var(--color-stroke), 0 0 24px var(--color-cyan-soft)",
        }}
      >
        {/* corner brackets */}
        <span className="absolute left-2 top-2 z-[2] h-3 w-3 border-l border-t border-cyan" />
        <span className="absolute right-2 top-2 z-[2] h-3 w-3 border-r border-t border-cyan" />
        <span className="absolute bottom-2 left-2 z-[2] h-3 w-3 border-b border-l border-cyan" />
        <span className="absolute bottom-2 right-2 z-[2] h-3 w-3 border-b border-r border-cyan" />

        {/* top label */}
        <div className="absolute inset-x-3 top-3 z-[2] flex items-center justify-between">
          <span className="text-hud-label text-cyan">// LIVE_FEED :: TRANSMISSION</span>
          <span className="flex items-center gap-2 text-hud-label text-violet">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-violet"
              style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }}
            />
            REC
          </span>
        </div>

        {mounted ? (
          <>
            <video
              ref={videoRef}
              src="/tamir-video.mp4"
              preload="metadata"
              playsInline
              loop
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={toggle}
              data-cursor={playing ? "pause feed" : "play feed"}
              className="absolute inset-0 z-[3] flex items-center justify-center transition-colors duration-200 hover:bg-bg/30 focus:outline-none"
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {!playing ? (
                <span
                  aria-hidden
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan"
                  style={{
                    boxShadow: "0 0 24px var(--color-cyan-soft)",
                    background: "rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-cyan" />
                </span>
              ) : null}
            </button>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-hud-label text-text-dim">// loading feed…</span>
          </div>
        )}

        {/* scanline overlay inside frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,229,255,0.05) 0 1px, transparent 1px 3px)",
            mixBlendMode: "overlay",
          }}
        />
      </motion.div>
    </div>
  );
}
