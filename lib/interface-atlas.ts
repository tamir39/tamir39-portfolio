const repository = "https://github.com/tamir39/interface-atlas";

export const interfaceAtlas = {
  name: "Interface Atlas",
  href: repository,
  previewHref: "https://tamir39.github.io/interface-atlas/",
  description: "I’m building a frontend UI/UX knowledge library to give my coding agents a clear design direction for each project.",
  workflow: "I choose the relevant guidance, adapt it to the project, and put the decisions in a self-contained design document. My agents use that document as their brief for the build.",
  scope: "The first theme is Editorial, adapted from this portfolio. The pilot includes typography, color, layout, accessibility, and motion rules, with portfolio and agent workspace examples. It’s still in development.",
  references: {
    editorial: { name: "Editorial theme", href: `${repository}/tree/main/themes/editorial` },
    design: { name: "Design principles", href: `${repository}/blob/main/themes/editorial/design.md` },
    motion: { name: "Motion guidance", href: `${repository}/blob/main/themes/editorial/motion.md` },
    agentExperience: { name: "Agent interface guidance", href: `${repository}/blob/main/knowledge/agent-experience.md` },
    preparation: { name: "Prepare a project design", href: `${repository}/blob/main/skills/prepare-frontend-design/SKILL.md` },
    examples: { name: "Project design examples", href: `${repository}/tree/main/examples` },
    preview: { name: "Editorial live preview", href: "https://tamir39.github.io/interface-atlas/themes/editorial/preview/" },
  },
} as const;
