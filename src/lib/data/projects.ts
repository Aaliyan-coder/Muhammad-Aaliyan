/**
 * Canonical project list, kept in sync with the résumé in `public/resume.pdf`.
 *
 * Separate from `featured.ts`, which exists only to match and enrich GitHub
 * repos by keyword. This is the source of truth for what Aaliyan has built.
 */
export type Project = {
  name: string;
  blurb: string;
  year: string;
  tech: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    name: "Worker Safety Monitor",
    blurb:
      "Real-time computer-vision system detecting PPE compliance and danger-zone dwell violations from a live camera feed.",
    year: "2026",
    tech: ["YOLOv8", "ByteTrack", "OpenCV", "FastAPI", "WebSockets", "React", "Three.js"],
    highlights: [
      "Custom-trained YOLOv8 detector with ByteTrack tracking and temporal smoothing to suppress false positives",
      "FastAPI + WebSocket backend streaming live frames to a React/Three.js control room with 3D replay",
      "Backed by 315 automated tests",
    ],
  },
  {
    name: "VERIDEX",
    blurb:
      "Local-first agentic RAG platform for evidence-grounded literature research.",
    year: "2026",
    tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Qdrant", "Redis", "Celery", "Ollama"],
    highlights: [
      "Orchestrates planner, researcher, evidence and citation agents over hybrid vector + BM25 retrieval with cross-encoder reranking",
      "Anti-fabrication layer verifies every AI-proposed quote against its source before acceptance",
      "Computes deterministic SUPPORTED/CONTRADICTED verdicts from evidence weights rather than model opinion",
    ],
  },
  {
    name: "VisuaPrompt",
    blurb:
      "No-code AutoML and data-analytics platform taking a raw dataset from upload to explainable predictions.",
    year: "2025",
    tech: ["FastAPI", "React 19", "scikit-learn", "XGBoost", "LightGBM", "spaCy", "Plotly"],
    highlights: [
      "37 JWT-secured REST endpoints behind a 13-page React 19 UI, validated end-to-end with Pytest",
      "AutoML pipeline auto-detects task type and benchmarks 13+ algorithms",
      "spaCy/NLTK query engine answers plain-English questions about a dataset",
    ],
  },
  {
    name: "Knowledge-Based Conversational AI",
    blurb:
      "Hybrid chatbot unifying three reasoning paradigms — rule-based dialogue, logic inference and graph memory.",
    year: "2024",
    tech: ["Python", "Flask", "Neo4j", "AIML", "Prolog", "NLTK"],
    highlights: [
      "AIML dialogue + Prolog inference via pyswip + Neo4j graph memory for multi-hop relationship queries",
      "NLTK POS tagging routes each query to the right reasoning engine",
      "Cypher templates cut average graph traversal time by 35%",
    ],
  },
];
