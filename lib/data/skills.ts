export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "C#", "Java", "PHP", "SQL"],
  },
  {
    category: "Engines & Frameworks",
    items: ["Unity", "Next.js", "Three.js", "PyTorch"],
  },
  {
    category: "AI & Data",
    items: ["LLM / RAG", "NLP", "Computer Vision", "Deep Learning", "A* Search"],
  },
  {
    category: "Concepts",
    items: ["OOP", "Data Structures", "Game AI", "Software Engineering"],
  },
  {
    category: "Delivery",
    items: ["Agile / Scrum", "Functional Testing", "Integration Testing", "Project Management"],
  },
];

export const languages = [
  { name: "Vietnamese", level: 100, label: "NATIVE" },
  { name: "English", level: 80, label: "PROFICIENT" },
];

export const softSkills = ["Project Management", "Communication", "Problem-solving"];
