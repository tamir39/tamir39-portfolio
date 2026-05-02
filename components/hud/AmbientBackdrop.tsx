import Image from "next/image";

export function AmbientBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/tamir-avatar.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain"
          style={{
            opacity: 0.18,
            filter: "saturate(1.1) contrast(1.05)",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.95) 100%)",
        }}
      />
    </>
  );
}
