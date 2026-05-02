export function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      data-theme-only="dark"
      className="pointer-events-none fixed inset-0 z-[55] mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(0,229,255,0.07) 0 1px, transparent 1px 3px)",
      }}
    />
  );
}
