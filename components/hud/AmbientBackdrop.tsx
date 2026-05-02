import Image from "next/image";

export function AmbientBackdrop() {
  return (
    <>
      {/* Dark theme circuit board */}
      <div
        aria-hidden
        data-theme-only="dark"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/tamir-background-darkmode.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            opacity: 0.55,
            animation:
              "circuit-breath 16s ease-in-out infinite, circuit-pulse 8s ease-in-out infinite",
            willChange: "transform, filter",
          }}
        />
      </div>
      <div
        aria-hidden
        data-theme-only="dark"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Light theme circuit board */}
      <div
        aria-hidden
        data-theme-only="light"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/tamir-background-lightmode.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            opacity: 0.85,
            animation:
              "circuit-breath 16s ease-in-out infinite, circuit-pulse 8s ease-in-out infinite",
            willChange: "transform, filter",
          }}
        />
      </div>
      <div
        aria-hidden
        data-theme-only="light"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(236,236,228,0.45) 55%, rgba(236,236,228,0.7) 100%)",
        }}
      />
    </>
  );
}
