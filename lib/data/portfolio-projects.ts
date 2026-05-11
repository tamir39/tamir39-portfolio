export type PortfolioProject = {
  id: string;
  slug: string;
  category: string;
  name: string;
  description?: string;
  images: {
    col1a: string;
    col1b: string;
    col2: string;
  };
  liveUrl?: string;
  githubUrl?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "01",
    slug: "panic-hub",
    category: "Game Dev / LLM Agents",
    name: "Panic Hub",
    description:
      "Financial literacy platform built for GDGoC Hackathon. Pixel-art Godot game with GPT-4 NPC agents that simulate crowd panic and teach economic decision-making.",
    images: {
      col1a: "/projects/panic-hub/scene1.png",
      col1b: "/projects/panic-hub/scene2.png",
      col2: "/projects/panic-hub/background.png",
    },
    liveUrl: "https://gdgochackathon.com/",
    githubUrl: "https://github.com/LineLuLan/Panic-Hub",
  },
  {
    id: "02",
    slug: "100b-studio",
    category: "Frontend / Next.js · Three.js",
    name: "100B Studio",
    description:
      "Design studio landing with R3F 3D visualization, GSAP scroll sequences, and a Framer Motion component library.",
    images: {
      col1a: "/projects/100b-studio/logo.png",
      col1b: "/projects/100b-studio/inugami.png",
      col2: "/projects/100b-studio/ui-visield.png",
    },
  },
  {
    id: "03",
    slug: "mono-desk",
    category: "Full Stack / AI",
    name: "Mono Desk",
    description:
      "Multi-channel AI customer service platform. GPT-4o auto-responds across Shopify, Instagram, Discord, WhatsApp, Zalo — with human escalation via BullMQ + Redis queues.",
    images: {
      col1a: "/projects/mono-desk/ui-agent.png",
      col1b: "/projects/mono-desk/director.png",
      col2: "/projects/mono-desk/ui-bg.png",
    },
  },
];
