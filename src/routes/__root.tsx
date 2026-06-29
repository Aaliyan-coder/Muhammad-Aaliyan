import "@fontsource-variable/inter";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useLenis } from "../lib/lenis";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { GradientBackdrop, Noise } from "../components/fx/Noise";
import { Toaster } from "../components/ui/sonner";

const Cursor = lazy(() =>
  import("../components/fx/Cursor").then((m) => ({ default: m.Cursor })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl tracking-tight">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          That page is somewhere in the multiverse. Just not here.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Back home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl tracking-tight">
          Something glitched in the matrix.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again or head back to safety.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="glass rounded-full px-5 py-2.5 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_TITLE =
  "Aaliyan Arif — AI & Machine Learning Engineer · Full Stack Developer";
const SITE_DESC =
  "Portfolio of Aaliyan Arif — AI & ML engineer and full stack developer building intelligent systems with React, Django, Neo4j, TensorFlow and YOLOv8.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "theme-color", content: "#0a0c14" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { name: "author", content: "Aaliyan Arif" },
      {
        name: "keywords",
        content:
          "Aaliyan Arif, AI engineer, machine learning, full stack developer, React, Next.js, Django, Neo4j, TensorFlow, YOLOv8, portfolio",
      },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { title: "Muhammad Aaliyan" },
      { property: "og:title", content: "Muhammad Aaliyan" },
      { name: "twitter:title", content: "Muhammad Aaliyan" },
      { name: "description", content: "A digital portfolio showcasing AI/ML expertise with immersive 3D, advanced animations, and a futuristic design." },
      { property: "og:description", content: "A digital portfolio showcasing AI/ML expertise with immersive 3D, advanced animations, and a futuristic design." },
      { name: "twitter:description", content: "A digital portfolio showcasing AI/ML expertise with immersive 3D, advanced animations, and a futuristic design." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhammad Aaliyan Arif",
          jobTitle:
            "AI & Machine Learning Engineer, Full Stack Developer",
          email: "mailto:aaliyanrif@gmail.com",
          url: "https://aaliyan-s-portfolio.vercel.app",
          sameAs: [
            "https://github.com/Aaliyan-coder",
            "https://linkedin.com/in/aaliyan-arif-b17172276",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useLenis();

  return (
    <QueryClientProvider client={queryClient}>
      <GradientBackdrop />
      <Noise />
      <Cursor />
      <a
        href="#main"
        className="sr-only z-[200] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative z-[2]">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}
