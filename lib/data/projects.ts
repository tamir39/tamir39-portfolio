export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type Project = {
  slug: string;
  id: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  role: string;
  dates: string;
  stack: string[];
  summary: string;
  highlights: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "ai-astar-pacman",
    id: "MLOG-001",
    name: "AI A* Pacman",
    tagline: "Pathfinding sim with custom heuristic and teleport corners",
    status: "ARCHIVED",
    role: "Solo · Engineer",
    dates: "Jan 2025 — Mar 2025",
    stack: ["Python", "A* Search", "Game AI"],
    summary:
      "A pathfinding simulation built around the A* algorithm, retargeting Pacman as a multi-objective optimization problem.",
    highlights: [
      "Custom heuristic and pre-computed distance matrices for autonomous navigation toward multiple targets.",
      "Specialized state-space logic for teleportation between map corners and a power-up that enables temporary wall-passing.",
      "Visualization of the search frontier, frontier expansion, and final path in the same loop.",
    ],
  },
  {
    slug: "escape-the-belt",
    id: "MLOG-002",
    name: "Escape The Belt",
    tagline: "2D space-survival physics game with adaptive difficulty",
    status: "ACTIVE",
    role: "Solo · Engineer",
    dates: "Feb 2026 — Mar 2026",
    stack: ["Unity", "C#", "2D Physics"],
    summary:
      "A physics-driven survival game built in Unity. The player navigates an asteroid belt while difficulty scales with progress.",
    highlights: [
      "Distinct controllers for the player and environmental hazards, decoupled for clean iteration.",
      "Dynamic spawning system that scales obstacle frequency through linear interpolation tied to player progress.",
      "Tuned for short, replayable runs with escalating tension.",
    ],
  },
  {
    slug: "tenant-management",
    id: "MLOG-003",
    name: "Tenant Management Platform",
    tagline: "Full-stack landlord/tenant system, shipped on Agile cadence",
    status: "ARCHIVED",
    role: "Project Manager · Tester",
    dates: "Sep 2025 — Dec 2025",
    stack: ["Agile/Scrum", "QA", "Integration Testing"],
    summary:
      "Coordinated delivery of a full-stack management platform spanning landlord and tenant modules.",
    highlights: [
      "Orchestrated workflows using Agile/Scrum — sprint planning, task allocation, cross-functional comms.",
      "Authored and executed functional + integration test plans; surfaced critical bugs before release.",
      "Owned reliability across both modules end-to-end.",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
