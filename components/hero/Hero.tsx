import { OrbitalRing } from "./OrbitalRing";
import { HeroPortrait } from "./HeroPortrait";
import { Typewriter } from "./Typewriter";
import { PrimaryCtas } from "./PrimaryCtas";

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen items-center justify-center px-6 pb-24 pt-32 md:px-16 lg:px-32"
    >
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          <OrbitalRing />
          <HeroPortrait />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-hud-label text-cyan">00 — Tamir39</span>
            <h1 className="text-glow-cyan font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              PHI VUONG
              <br />
              TUONG TAM
            </h1>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-text-soft">
              tamir39 · frontend · ai · games
            </p>
          </div>

          <div className="glass-hi relative max-w-xl px-5 py-4">
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-cyan" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-cyan" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan" />
            <Typewriter />
          </div>

          <PrimaryCtas />
        </div>
      </div>

      <a
        href="#profile"
        aria-label="Continue to profile"
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim transition-colors group-hover:text-cyan">
          ▸ Profile
        </span>
        <span
          aria-hidden
          className="block h-9 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-cyan), transparent)",
            boxShadow: "0 0 8px var(--color-cyan-soft)",
            animation: "pulse-dot 1.4s ease-in-out infinite",
          }}
        />
      </a>
    </section>
  );
}
