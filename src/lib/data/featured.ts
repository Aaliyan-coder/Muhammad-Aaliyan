// Curated fallback used when GitHub matches aren't found by name.
export type FeaturedProject = {
  name: string;
  description: string;
  tech: string[];
  year: string;
  metrics: string[];
  repoUrl?: string;
  homepage?: string;
};

export const featuredFallback: FeaturedProject[] = [
  {
    name: "Knowledge Graph Chatbot",
    description:
      "Conversational AI chatbot backed by a Neo4j graph database, enabling multi-hop relationship queries impossible with flat SQL schemas.",
    tech: ["Neo4j", "Python", "Cypher", "LangChain"],
    year: "2024",
    metrics: [
      "35% faster query execution vs naive traversal",
      "Multi-hop reasoning over a custom knowledge graph",
    ],
  },
  {
    name: "Real-Time Object Detection System",
    description:
      "YOLOv8 inference pipeline for live video streams, optimized OpenCV preprocessing for smooth real-time detection on standard hardware.",
    tech: ["Python", "YOLOv8", "OpenCV"],
    year: "2024",
    metrics: [
      "<80ms latency per frame (~2× baseline)",
      "20% lower CPU overhead, sustained 30 fps",
    ],
  },
];

export const FEATURED_KEYWORDS = [
  ["knowledge", "graph", "chatbot"],
  ["yolo", "object", "detection"],
];
