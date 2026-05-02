import type { ProjectStatus } from "@/lib/data/projects";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const isActive = status === "ACTIVE";
  const tone = isActive ? "text-cyan border-cyan" : "text-violet border-violet";
  const dot = isActive ? "bg-cyan" : "bg-violet";

  return (
    <span
      className={`inline-flex items-center gap-2 border ${tone} px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${dot}`}
        style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }}
      />
      STATUS · {status}
    </span>
  );
}
