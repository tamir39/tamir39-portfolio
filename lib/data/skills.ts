export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "C#", "Java", "TypeScript"],
  },
  {
    category: "Engines & Frameworks",
    items: ["Unity", "Next.js"],
  },
  {
    category: "Concepts",
    items: ["A* Search", "OOP", "Data Structures", "Game AI", "Software Engineering"],
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
