import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects, projectsQueryOptions } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { AIFocus } from "@/components/sections/AIFocus";
import { Contact } from "@/components/sections/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Aaliyan Arif — AI & Machine Learning Engineer · Full Stack Developer",
      },
    ],
  }),
  loader: ({ context }) => {
    // Prime GitHub repos so Projects renders SSR without a client-side spinner
    void context.queryClient.prefetchQuery(projectsQueryOptions);
  },
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <AIFocus />
      <Contact />
    </>
  );
}
