function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-2 left-2 border-l border-t",
    tr: "top-2 right-2 border-r border-t",
    bl: "bottom-2 left-2 border-l border-b",
    br: "bottom-2 right-2 border-r border-b",
  };
  return (
    <span
      aria-hidden
      className={`pointer-events-none fixed z-[59] h-3 w-3 border-cyan ${map[position]}`}
    />
  );
}

export function HudFrame() {
  return (
    <>
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />
    </>
  );
}
