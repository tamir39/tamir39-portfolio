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
    slug: "panic-hub",
    id: "01",
    name: "Panic Hub",
    tagline: "Multi-agent economic crisis simulator — GDG OC Hackathon 2026",
    status: "ACTIVE",
    role: "CS Frontend · Godot",
    dates: "Mar 2026 — present",
    stack: ["Godot 4", "GDScript", "WebSocket", "LLM Agents", "FastAPI"],
    summary:
      "A hackathon entry where the player acts as Mayor of a city whose 50 LLM-driven NPCs panic through a simulated economic crisis. CS team owns the Godot frontend; DS team owns the FastAPI backend; the two are joined over WebSocket.",
    highlights: [
      "Godot 4 client renders 50 pathfinding NPCs (TileMap + NavigationRegion2D + CharacterBody2D) reacting to live server events.",
      "Network manager autoload survives disconnects, heartbeats, and a 10s server-timeout fallback to a wander loop.",
      "Fixed message catalogue across the bridge: spawn_npcs, npc_batch_update, market_update, policy_result, post_mortem.",
      "Built for GDG OC Hackathon 2026 (gdgochackathon.com).",
    ],
    links: [
      { label: "Hackathon", href: "https://gdgochackathon.com/" },
      { label: "GitHub", href: "https://github.com/LineLuLan/Panic-Hub" },
    ],
  },
  {
    slug: "100b-studio",
    id: "02",
    name: "100B Studio — Frontend",
    tagline: "Landing page for a fullstack engineering studio I co-build",
    status: "ACTIVE",
    role: "Team · Frontend",
    dates: "2026 — present",
    stack: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    summary:
      "Public-facing landing site for 100B Studio — a fullstack engineering team I co-build. Targeting Stripe / Linear / Vercel-grade frontend craft, every interaction is deliberate and signals systems thinking, not generic SaaS template.",
    highlights: [
      "Single-route Next.js site engineered to scale into multi-route services and case studies without rework.",
      "Bilingual EN/VI eyebrow copy threaded through the layout for tonal texture.",
      "Built to read as if it were made by the team it represents — production craft is the proof.",
    ],
  },
  {
    slug: "mono-desk",
    id: "03",
    name: "Mono Desk",
    tagline: "Multi-channel AI customer service for SEA SMBs",
    status: "ACTIVE",
    role: "Solo · Full-stack",
    dates: "2026 — present",
    stack: ["Next.js", "GPT-4o", "Prisma", "Postgres", "Docker"],
    summary:
      "Unifies inbound chats from 7 channels (Shopify, Instagram, Discord, Facebook, WhatsApp, Zalo, web widget) into one inbox, auto-replies via a GPT-4o agent grounded in the merchant's catalog, and escalates to humans when confidence drops.",
    highlights: [
      "Confidence-routing layer that escalates to humans on refund/cancel keywords, repetition, or sensitive topics.",
      "Auto-captures phone/email leads from natural conversation.",
      "Vietnamese-first localization with EN/JA/KO/ZH on the roadmap.",
      "Embeddable storefront widget so the same agent lives wherever the customer talks.",
    ],
  },
  {
    slug: "zuno",
    id: "04",
    name: "Zuno",
    tagline: "Private timeline 'Zones' for school classes, families, and duos",
    status: "ACTIVE",
    role: "Solo · Full-stack",
    dates: "2026 — present",
    stack: ["Next.js", "Drizzle", "Postgres", "Cloudflare R2"],
    summary:
      "A small, private, time-ordered space — the MVP is a Class Zone where one school class can post, react, vote, and keep streaks together.",
    highlights: [
      "Full register → create-Zone → invite → post → react → vote → streak loop on a single Next.js deployment.",
      "Every state change is a domain event on an in-process event bus, even before listeners exist — built for clean Phase-2 expansion.",
      "Image hosting on Cloudflare R2; Postgres via Drizzle.",
    ],
  },
  {
    slug: "escape-the-belt",
    id: "05",
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
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/escape-the-belt-2d-game" },
    ],
  },
  {
    slug: "rag-vn-law-advisor",
    id: "06",
    name: "VN Law RAG Advisor",
    tagline: "Retrieval-augmented LLM that answers Vietnamese legal questions",
    status: "ACTIVE",
    role: "Solo · ML Engineer",
    dates: "2026",
    stack: ["Python", "LLM", "RAG", "Vector DB", "NLP"],
    summary:
      "A retrieval-augmented chatbot that grounds LLM answers in real Vietnamese legal documents instead of model memory.",
    highlights: [
      "Document ingestion + chunking pipeline tuned for Vietnamese legal text.",
      "Vector retrieval feeds an LLM that cites source articles in its responses.",
      "Designed to reduce hallucination on a domain where wrong answers carry real consequence.",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tamir39/rag-llm-vietnam-law-advisor",
      },
    ],
  },
  {
    slug: "solar-system",
    id: "07",
    name: "Solar System",
    tagline: "Interactive WebGL solar system — frontend exploration",
    status: "ACTIVE",
    role: "Solo · Frontend",
    dates: "2026",
    stack: ["TypeScript", "Three.js", "WebGL", "Next.js"],
    summary:
      "A browser-based, navigable solar-system visualization built to push WebGL/Three.js skills.",
    highlights: [
      "Real-time 3D scene with orbiting bodies and camera controls.",
      "Optimized for smooth performance on mid-range hardware.",
      "Live demo deployed on Vercel.",
    ],
    links: [
      { label: "Live Demo", href: "https://portfolio-two-orpin-55.vercel.app" },
      { label: "GitHub", href: "https://github.com/tamir39/solar-system" },
    ],
  },
  {
    slug: "ai-astar-pacman",
    id: "08",
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
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/AI-AStar-with-Pacman" },
    ],
  },
  {
    slug: "tenant-management",
    id: "09",
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
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/tenant-management-platform" },
    ],
  },
  {
    slug: "vqa-viet",
    id: "10",
    name: "VQA Viet",
    tagline: "Vietnamese Visual Question Answering — deep-learning final project",
    status: "ARCHIVED",
    role: "Team · ML Engineer",
    dates: "2026",
    stack: ["Python", "PyTorch", "Deep Learning", "NLP", "Computer Vision"],
    summary:
      "A multi-modal model that answers natural-language questions about images, trained and evaluated on Vietnamese-language data.",
    highlights: [
      "End-to-end pipeline: image encoder + language encoder fused into a joint representation for answer prediction.",
      "Adapted English-first VQA techniques to Vietnamese tokenization and grammar quirks.",
      "Final project for the Deep Learning course — full report and ablations included in the repo.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/vqa-viet-project" },
    ],
  },
  {
    slug: "vi-finance-summarizer",
    id: "11",
    name: "VI Finance Summarizer",
    tagline: "Vietnamese financial-news summarizer — NLP final project",
    status: "ARCHIVED",
    role: "Team · ML Engineer",
    dates: "2026",
    stack: ["Python", "NLP", "Transformers", "Summarization"],
    summary:
      "Abstractive summarization model targeted at Vietnamese financial articles — built and evaluated for the NLP course final.",
    highlights: [
      "Cleaned and tokenized a corpus of Vietnamese finance articles for fine-tuning.",
      "Compared baseline extractive methods against a fine-tuned transformer summarizer.",
      "Course final project — graded artifact, reproducible from the repo.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/vi-finance-summarizer" },
    ],
  },
  {
    slug: "applied-ai-algorithms",
    id: "12",
    name: "Applied AI Algorithms",
    tagline: "Coursework collection of classical AI algorithms",
    status: "ARCHIVED",
    role: "Solo · Engineer",
    dates: "2026",
    stack: ["Python", "Search", "Optimization", "Game AI"],
    summary:
      "A curated set of applied AI algorithm implementations from coursework — search, adversarial, and constraint problems.",
    highlights: [
      "Reference implementations of search and optimization algorithms.",
      "Each module is self-contained with notes and runnable demos.",
      "Used as a personal cheat-sheet repo for AI fundamentals.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/tamir39/applied-AI-algorithms" },
    ],
  },
  {
    slug: "sales-customer-management",
    id: "13",
    name: "Sales & Customer Management",
    tagline: "PHP-based CRM for sales pipelines and customer records",
    status: "ARCHIVED",
    role: "Solo · Full-stack",
    dates: "2026",
    stack: ["PHP", "MySQL", "HTML/CSS"],
    summary:
      "A web-based system for tracking customers, sales activity, and pipeline state — built as a full-stack PHP exercise.",
    highlights: [
      "CRUD over customers, products, and sales records.",
      "Server-rendered PHP with MySQL persistence.",
      "Built to learn server-side fundamentals end-to-end.",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tamir39/sales-customer-management-web",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
