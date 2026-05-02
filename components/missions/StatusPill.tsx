import type { ProjectStatus } from "@/lib/data/projects";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const isActive = status === "ACTIVE";
  const tone = isActive
    ? "text-cyan border-cyan"
    : "text-violet border-violet";
  const dot = isActive ? "bg-cyan" : "bg-violet";
  const inset = isActive
    ? "0 0 0 1px var(--color-cyan), inset 0 0 8px var(--color-cyan-soft)"
    : "0 0 0 1px var(--color-violet), inset 0 0 8px var(--color-violet-soft)";

  return (
    <span
      className={`inline-flex items-center gap-2 border ${tone} bg-bg/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]`}
      style={{ boxShadow: inset }}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${dot}`}
        style={{
          animation: "pulse-dot 1.4s ease-in-out infinite",
          boxShadow: isActive
            ? "0 0 6px var(--color-cyan)"
            : "0 0 6px var(--color-violet)",
        }}
      />
      STATUS · {status}
    </span>
  );
}
