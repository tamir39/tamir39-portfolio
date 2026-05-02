import Image from "next/image";

export function AmbientBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/tamir-background.png"
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
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />
    </>
  );
}
