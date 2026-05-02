export type EducationEntry = {
  id: string;
  school: string;
  span: string;
  detail: string;
  highlight?: string;
};

export const education: EducationEntry[] = [
  {
    id: "EDU-02",
    school: "Ton Duc Thang University",
    span: "Aug 2023 — Jun 2027 (expected)",
    detail:
      "Bachelor of Computer Science. Coursework: Object-Oriented Programming, Data Structures & Algorithms, Introduction to AI, Software Engineering.",
    highlight: "GPA 7.62 · Recent semester 8.21",
  },
  {
    id: "EDU-01",
    school: "Vo Thi Sau High School",
    span: "Sep 2020 — Jun 2023",
    detail: "Graduated with score 25.55 / 30.",
    highlight: "GPA 9.4 / 10",
  },
];
