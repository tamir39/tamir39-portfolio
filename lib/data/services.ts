export type Service = {
  number: string;
  name: string;
  description: string;
};

export const services: Service[] = [
  {
    number: "01",
    name: "Frontend Development",
    description:
      "Pixel-precise UIs with Next.js, React, and Tailwind. From design systems to scroll-driven animations — shipped with type-safe code and production performance.",
  },
  {
    number: "02",
    name: "Game Development",
    description:
      "2D and prototype-stage games in Godot and Unity. Pathfinding agents, physics systems, networked NPCs, and gameplay loops built to iterate fast.",
  },
  {
    number: "03",
    name: "UI/UX Design",
    description:
      "Clean visual systems grounded in hierarchy and intent. Figma prototypes and component libraries that bridge design and engineering without translation loss.",
  },
  {
    number: "04",
    name: "AI Integration",
    description:
      "LLM-powered features and RAG pipelines — confidence routing, structured outputs, multi-agent coordination, and Vietnamese-language NLP.",
  },
  {
    number: "05",
    name: "Full Stack Engineering",
    description:
      "End-to-end product delivery: Next.js front, FastAPI or Node back, Postgres, Docker. Architected for clean separation so each layer can scale independently.",
  },
];
