export function Vignette() {
  return (
    <div
      aria-hidden
      data-theme-only="dark"
      className="pointer-events-none fixed inset-0 z-[54]"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.45) 100%)",
      }}
    />
  );
}
