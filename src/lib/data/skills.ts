export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Cypher", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    label: "Backend",
    items: ["Django", "Django REST", "Node.js", "FastAPI", "Flask"],
  },
  {
    label: "AI / ML",
    items: [
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "YOLOv8",
      "OpenCV",
      "LangChain",
    ],
  },
  {
    label: "Data",
    items: ["Pandas", "NumPy", "Matplotlib", "RAG", "Vector DBs"],
  },
  {
    label: "Databases & Cloud",
    items: ["Neo4j", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git"],
  },
];

export const flatSkills = skillGroups.flatMap((g) => g.items);
