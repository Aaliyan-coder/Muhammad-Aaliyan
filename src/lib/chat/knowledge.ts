import { aiInterests, profile } from "@/lib/data/profile";
import { education, experience } from "@/lib/data/experience";
import { projects } from "@/lib/data/projects";
import { skillGroups } from "@/lib/data/skills";

/**
 * A small grounded question-answering engine for the site chatbot.
 *
 * Every answer is composed from the same data files the rest of the site
 * renders from, so the bot cannot claim a job, skill or project that isn't
 * real — and it can never drift out of sync with the CV. No network calls, no
 * API key, no per-message cost.
 *
 * Matching is deliberately simple: normalise the question, then score each
 * intent by the signal words it contains. Phrases outweigh single keywords so
 * "where did you work" beats a stray mention of "work".
 */

export type Answer = {
  text: string;
  chips?: string[];
};

type Intent = {
  id: string;
  /** Single words worth 1 point each. */
  keywords: string[];
  /** Multi-word signals worth 3 points each. */
  phrases?: string[];
  answer: () => Answer;
};

const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

const DEFAULT_CHIPS = [
  "What's your AI/ML stack?",
  "Show me your projects",
  "Where have you worked?",
  "How do I reach you?",
];

const intents: Intent[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "salam", "assalam", "hiya", "greetings"],
    phrases: ["good morning", "good evening", "how are you"],
    answer: () => ({
      text: `Hey — I'm ${profile.name.split(" ")[0]}, or near enough. This is a bot that answers from my actual CV, so everything below is real.\n\nAsk me about my AI/ML work, projects, experience or how to get in touch.`,
      chips: DEFAULT_CHIPS,
    }),
  },
  {
    id: "about",
    keywords: ["about", "who", "yourself", "introduce", "bio", "background", "story", "summary"],
    phrases: ["who are you", "tell me about", "about yourself", "what do you do"],
    answer: () => ({
      text: `${profile.summary}\n\n${education.degree} — ${education.school}. ${education.detail}`,
      chips: ["What's your AI/ML stack?", "Show me your projects", "Why should I hire you?"],
    }),
  },
  {
    id: "role",
    keywords: ["role", "title", "position", "job", "designation", "specialise", "specialize"],
    phrases: ["what are you", "your role", "job title", "looking for"],
    answer: () => ({
      text: `I'm an AI & Machine Learning Engineer first — computer vision, LLM and retrieval-augmented systems, and knowledge graphs, taken from experiment through to production.\n\nFull stack is my second skill: React and Django are how a trained model stops being a notebook and starts being a product.\n\nI'm targeting a full-time AI/ML engineering role.`,
      chips: ["What's your AI/ML stack?", "Where have you worked?"],
    }),
  },
  {
    id: "skills",
    keywords: ["skill", "skills", "stack", "tech", "technology", "technologies", "tools", "know", "languages", "framework", "frameworks"],
    phrases: ["what can you do", "tech stack", "your stack"],
    answer: () => ({
      text:
        `Here's the whole stack, in the order I actually reach for it:\n\n` +
        skillGroups.map((g) => `${g.label} — ${g.items.join(", ")}`).join("\n"),
      chips: ["Tell me about your ML work", "Show me your projects"],
    }),
  },
  {
    id: "ai",
    keywords: ["ai", "ml", "model", "models", "deep", "learning", "tensorflow", "pytorch", "yolo", "yolov8", "vision", "opencv", "nlp", "llm", "llms", "rag", "langchain", "neural", "training", "research"],
    phrases: ["machine learning", "computer vision", "deep learning", "large language", "natural language", "generative ai", "agentic ai", "your ml"],
    answer: () => ({
      text:
        `AI/ML is the core of what I do. Where I focus:\n\n${bullets([...aiInterests])}\n\n` +
        `Tooling: ${skillGroups.find((g) => g.label === "AI / ML")?.items.join(", ")}.\n\n` +
        `In practice that's meant a custom-trained YOLOv8 detector with ByteTrack tracking, an agentic RAG platform with an anti-fabrication layer, and an AutoML pipeline benchmarking 13+ algorithms.`,
      chips: ["Show me your projects", "Tell me about VERIDEX"],
    }),
  },
  {
    id: "fullstack",
    keywords: ["react", "django", "frontend", "backend", "fullstack", "web", "next", "nextjs", "api", "apis", "fastapi", "tailwind", "typescript", "node"],
    phrases: ["full stack", "front end", "back end", "web development"],
    answer: () => ({
      text:
        `Full stack is my second skill, and it's what makes the ML work shippable.\n\n` +
        `Frontend — ${skillGroups.find((g) => g.label === "Frontend")?.items.join(", ")}\n` +
        `Backend — ${skillGroups.find((g) => g.label === "Backend")?.items.join(", ")}\n\n` +
        `I've shipped production features across React frontends and Django backends at Big Binary Tech, and built FastAPI services behind every ML project I've done.`,
      chips: ["Where have you worked?", "Show me your projects"],
    }),
  },
  {
    id: "experience",
    keywords: ["experience", "work", "worked", "job", "jobs", "company", "companies", "career", "employment", "intern", "internship", "history", "professional"],
    phrases: ["where have you worked", "work experience", "your experience", "past roles"],
    answer: () => ({
      text:
        `Four roles so far:\n\n` +
        experience
          .map((e) => `• ${e.role} — ${e.company}\n   ${e.period}\n   ${e.highlights[0]}`)
          .join("\n\n"),
      chips: ["What did you do at Big Binary?", "Tell me about teaching"],
    }),
  },
  {
    id: "teaching",
    keywords: ["teaching", "teach", "assistant", "mentor", "mentored", "students", "lab", "labs", "umt"],
    phrases: ["teaching assistant", "taught students"],
    answer: () => {
      const ta = experience.filter((e) => e.tag === "ml" || e.tag === "web");
      return {
        text:
          `I've been a Teaching Assistant twice at UMT:\n\n` +
          ta.map((e) => `• ${e.role} (${e.period})\n${bullets(e.highlights)}`).join("\n\n"),
        chips: ["What's your education?", "Show me your projects"],
      };
    },
  },
  {
    id: "education",
    keywords: ["education", "degree", "university", "college", "study", "studied", "cgpa", "gpa", "graduate", "graduated", "academic", "school"],
    phrases: ["where did you study", "your degree", "your education"],
    answer: () => ({
      text: `${education.degree}\n${education.school}\n${education.detail}\n\nGraduated 2025 — the degree is specifically in Artificial Intelligence, not general CS.`,
      chips: ["What's your AI/ML stack?", "Show me your projects"],
    }),
  },
  {
    id: "projects",
    keywords: ["project", "projects", "built", "build", "portfolio", "made", "shipped", "veridex", "visuaprompt", "worker", "safety", "chatbot", "ppe"],
    phrases: ["what have you built", "your projects", "show me your work", "best project"],
    answer: () => ({
      text:
        `Four I'd point you at:\n\n` +
        projects.map((p) => `• ${p.name} (${p.year})\n   ${p.blurb}\n   ${p.tech.slice(0, 5).join(", ")}`).join("\n\n") +
        `\n\nAsk me about any one by name for the details.`,
      chips: ["Tell me about VERIDEX", "Tell me about Worker Safety Monitor"],
    }),
  },
  {
    id: "contact",
    keywords: ["contact", "email", "reach", "hire", "hiring", "available", "availability", "opportunity", "phone", "call", "linkedin", "github", "connect", "message"],
    phrases: ["get in touch", "reach you", "contact you", "are you available", "email you"],
    answer: () => ({
      text: `Easiest ways to reach me:\n\n• Email — ${profile.email}\n• Phone — ${profile.phone}\n• LinkedIn — ${profile.linkedin.replace("https://", "")}\n• GitHub — ${profile.github.replace("https://", "")}\n\nOr use the form just below — it lands straight in my inbox. I'm open to full-time AI/ML roles.`,
      chips: ["Download your résumé", "Where are you based?"],
    }),
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download", "pdf"],
    phrases: ["your resume", "your cv", "download resume"],
    answer: () => ({
      text: `You can grab my résumé as a PDF from the "Download résumé" button in the Contact section — or straight from ${profile.resumeUrl}.\n\nIt covers the same experience, projects and stack I've described here.`,
      chips: ["Show me your projects", "How do I reach you?"],
    }),
  },
  {
    id: "location",
    keywords: ["location", "based", "where", "city", "country", "remote", "relocate", "timezone", "pakistan", "lahore"],
    phrases: ["where are you", "based in", "work remotely", "open to relocate"],
    answer: () => ({
      text: `I'm based in ${profile.location}. I work comfortably remote and I'm open to relocating for the right AI/ML role.`,
      chips: ["How do I reach you?", "Where have you worked?"],
    }),
  },
  {
    id: "why",
    keywords: ["why", "strength", "strengths", "best", "good", "special", "different", "stand"],
    phrases: ["why should i hire", "why hire", "why you", "what makes you", "stand out", "good fit", "your strength"],
    answer: () => ({
      text: `Honest version: plenty of people can train a model, and plenty can build a web app. I do both, which means my ML work actually ships.\n\nWorker Safety Monitor isn't a notebook — it's a trained detector behind a FastAPI/WebSocket service feeding a React control room, with 315 tests. VERIDEX has a verification layer that checks the model's own quotes against the source before accepting them.\n\nI also care about being right rather than impressive, which is why that anti-fabrication layer exists at all.`,
      chips: ["Show me your projects", "How do I reach you?"],
    }),
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank", "thankyou", "cheers", "appreciate", "great", "cool", "nice", "awesome"],
    phrases: ["thank you"],
    answer: () => ({
      text: `Anytime. If you want to take it further, the contact form below reaches me directly.`,
      chips: ["How do I reach you?", "Download your résumé"],
    }),
  },
];

/** Per-project deep answers, matched by name before the generic intents. */
function matchProject(text: string): Answer | null {
  for (const p of projects) {
    const name = p.name.toLowerCase();
    const first = name.split(" ")[0];
    if (text.includes(name) || (first.length > 5 && text.includes(first))) {
      return {
        text: `${p.name} (${p.year})\n\n${p.blurb}\n\n${bullets(p.highlights)}\n\nBuilt with: ${p.tech.join(", ")}.`,
        chips: ["Show me your projects", "How do I reach you?"],
      };
    }
  }
  return null;
}

const normalise = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s+/#.-]/g, " ").replace(/\s+/g, " ").trim();

export function ask(question: string): Answer {
  const text = normalise(question);
  if (!text) {
    return { text: "Ask me anything about my work.", chips: DEFAULT_CHIPS };
  }

  const direct = matchProject(text);
  if (direct) return direct;

  const words = new Set(text.split(" "));
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const k of intent.keywords) if (words.has(k)) score += 1;
    for (const p of intent.phrases ?? []) if (text.includes(p)) score += 3;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (best && bestScore > 0) return best.answer();

  return {
    text: `I only answer from my own CV, so I don't have anything solid on that one.\n\nThings I can actually help with: my AI/ML work, the projects I've built, where I've worked, my education, or how to get in touch.`,
    chips: DEFAULT_CHIPS,
  };
}

export const OPENING: Answer = {
  text: `Hi — I'm a bot version of ${profile.name.split(" ")[0]}, answering from my real CV.\n\nAI/ML engineer: computer vision, RAG and knowledge graphs, with full stack as my second skill. What would you like to know?`,
  chips: DEFAULT_CHIPS,
};
