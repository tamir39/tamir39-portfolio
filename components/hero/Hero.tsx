import { OrbitalRing } from "./OrbitalRing";
import { AvatarPortrait } from "./AvatarPortrait";
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
          <AvatarPortrait />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-hud-label text-cyan">// MAIN_00 :: OPERATOR</span>
            <h1 className="font-display text-4xl font-semibold tracking-wide md:text-5xl">
              PHI VUONG TUONG TAM
            </h1>
            <p className="text-hud-label text-text-dim">
              tamir39 · computer science · game dev · builder
            </p>
          </div>

          <div className="glass relative max-w-xl px-5 py-4">
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
        className="group absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-hud-label text-text-dim transition-colors group-hover:text-cyan">
          SCROLL ↓ TO CONTINUE
        </span>
        <span
          aria-hidden
          className="block h-4 w-px bg-text-dim transition-colors group-hover:bg-cyan"
        />
      </a>
    </section>
  );
}
