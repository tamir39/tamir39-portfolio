export function TechTag({ children }: { children: string }) {
  return (
    <span className="border border-stroke-bright px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-soft">
      {children}
    </span>
  );
}
