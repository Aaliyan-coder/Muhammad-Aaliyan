export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  tag: "engineering" | "frontend" | "ml" | "web";
};

export const experience: ExperienceItem[] = [
  {
    role: "Junior Full Stack Developer",
    company: "Big Binary Tech",
    period: "Apr 2026 — May 2026",
    tag: "engineering",
    highlights: [
      "Delivered three production-ready features across frontend and backend within a 6-week contract, meeting all sprint deadlines.",
      "Reduced bug-fix turnaround by independently diagnosing and patching both React components and Django API endpoints.",
      "Cut new-developer onboarding time ~30% by documenting full-stack workflows.",
    ],
  },
  {
    role: "Frontend Development Intern",
    company: "Code Alpha",
    period: "Jul 2025 — Oct 2025",
    tag: "frontend",
    highlights: [
      "Built and deployed four responsive web apps with React and Tailwind, each passing client acceptance on first review.",
      "Extracted 12+ shared UI components, reducing duplicate code by ~40%.",
      "Cut UI-related support tickets by 25% within one month of release.",
    ],
  },
  {
    role: "Teaching Assistant — Machine Learning",
    company: "University of Management & Technology",
    period: "Apr 2025 — Jul 2025",
    tag: "ml",
    highlights: [
      "Mentored 30+ students through model-training pipelines in TensorFlow & Scikit-learn — section achieved a 0.4 GPA-point average lift.",
      "Resolved 90% of student debugging issues live during lab sessions.",
    ],
  },
  {
    role: "Teaching Assistant — Web Development",
    company: "University of Management & Technology",
    period: "Nov 2024 — Feb 2025",
    tag: "web",
    highlights: [
      "Designed and delivered 8 hands-on labs covering HTML, CSS, and JavaScript.",
      "Supported 50+ students with a 4.7/5.0 student satisfaction score.",
    ],
  },
];

export const education = {
  degree: "BS Artificial Intelligence",
  school: "University of Management & Technology (UMT)",
  detail: "CGPA 3.5 / 4.0 — Specialization in ML & Intelligent Systems",
};
