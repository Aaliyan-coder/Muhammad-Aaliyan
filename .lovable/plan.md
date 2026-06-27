
## Stack (Lovable-native equivalents of your Next.js spec)

- **Framework:** TanStack Start (React 19 + Vite, SSR) — replaces Next.js App Router. Same SSR/SEO capability via per-route `head()`.
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (Bloom, DoF, Vignette, Noise, GodRays where it earns its place), custom GLSL shaders, HDR environment.
- **Physics:** `@react-three/rapier` for gentle float/bounce on hero + skill orbs.
- **Animation:** `gsap` + `ScrollTrigger`, `framer-motion`, `@studio-freight/lenis` (smooth scroll), custom easings.
- **Styling:** Tailwind v4 (already configured) + design tokens in `src/styles.css`.
- **Fonts:** `@fontsource-variable/inter` (body) + `@fontsource/space-grotesk` (display) — installed via bun.
- **Icons:** `lucide-react`.

## Design direction

Dark cyber-luxury. No rainbow. Tokens added to `src/styles.css`:

- Base: near-black `oklch(0.12 0.02 260)` with subtle blue undertone
- Surface/glass: white at 4–8% with backdrop blur, 1px hairline border at white/8%
- Primary accent: cold cyan `oklch(0.82 0.13 220)`
- Secondary accent: soft violet `oklch(0.70 0.16 290)`
- Gradients: cyan→violet diagonal, used sparingly on headings, glows, and beams
- Type: Space Grotesk display (tight tracking, large), Inter body
- Motion: long eases (1.2–2.4s), staggered reveals, never bouncy

## Sections & 3D scenes

1. **Hero** — full-viewport R3F canvas: instanced particle field, animated neural-network node graph (lines with shader pulse), volumetric light beams, slow camera dolly, mouse-parallax tilt. Floating glass title "Aaliyan Arif" with kinetic subtitle cycling AI/ML Engineer · Full Stack Developer · AI Research. Two magnetic CTAs (View Work, Get in Touch). Optional ambient audio toggle (muted by default, no autoplay).
2. **About** — split layout: left side narrative from his summary; right side an interactive 3D "AI brain" — particle sphere that morphs into a torus knot on hover, rotating with scroll progress.
3. **Skills** — floating glass chips orbiting a central core in 3D, grouped: Languages, Frontend, Backend, AI/ML, Data, Databases. Hover lifts + glows the chip and dims others.
4. **Projects** — auto-fetched from `https://api.github.com/users/Aaliyan-coder/repos?sort=updated&per_page=100` in a TanStack Query loader. Filter forks/archived. Sort by stars then updated. Render premium glass cards with mouse-tilt (vanilla-tilt-style via framer-motion), language dot, stars, homepage + repo links. Card modal with full description, topics, README excerpt. Featured pinned: Knowledge Graph Chatbot, Real-Time Object Detection (matched by repo name; fallback to curated entries from resume if not found).
5. **Experience** — vertical scroll-grown timeline (SVG path drawn by ScrollTrigger). Cards for Big Binary Tech, Code Alpha, UMT TA (ML), UMT TA (Web) with metrics highlighted.
6. **AI Focus** — animated knowledge-graph visualization (force-directed nodes in R3F) with labels: AI, ML, Deep Learning, LLMs, Generative AI, Computer Vision, NLP, Agentic AI. Connections pulse.
7. **Contact** — glassmorphism form (Zod-validated: name, email, message) wired to `mailto:aaliyanarif@gmail.com` fallback + a server function placeholder for future email integration. Social row: GitHub (Aaliyan-coder), LinkedIn (aaliyan-arif-b17172276), Email, Phone, Resume download button (file placed at `public/resume.pdf` — user can replace).

## Global systems

- **Layout:** `__root.tsx` keeps existing shell. Add `<LenisProvider>`, `<CustomCursor>` (glow + magnetic), `<NoiseOverlay>`, `<SceneLoader>` (Suspense fallback), `<Navbar>` (fixed glass, scroll-shrinks), `<Footer>`.
- **Performance:** `AdaptiveDpr`, `PerformanceMonitor` from drei; particle counts scale with `regress` factor; postprocessing disabled below 30fps; `prefers-reduced-motion` short-circuits scroll/3D animations to static fallbacks; mobile detects coarse pointer and downgrades to lighter scenes.
- **SEO:** `__root.tsx` global meta + per-section route still single-page; OG image generated as static asset; JSON-LD `Person` schema with name, jobTitle, url, sameAs.
- **Accessibility:** semantic landmarks, skip-to-content, focus rings on all interactives, ARIA labels on icon buttons, keyboard-reachable cards/modals, reduced-motion variant of every scroll animation.

## File structure

```
src/
  routes/
    __root.tsx                 (+ Lenis, cursor, noise, navbar, footer)
    index.tsx                  (renders the full single-page experience)
  components/
    layout/{Navbar,Footer,SectionHeading}.tsx
    fx/{Cursor,Noise,Magnetic,SplitText,Reveal}.tsx
    three/
      HeroScene.tsx
      ParticleField.tsx
      NeuralNetwork.tsx
      LightBeams.tsx
      BrainOrb.tsx
      SkillsOrbit.tsx
      KnowledgeGraph.tsx
      shaders/{pulse.glsl.ts,gradient.glsl.ts}
    sections/
      Hero.tsx
      About.tsx
      Skills.tsx
      Projects.tsx
      ProjectCard.tsx
      ProjectModal.tsx
      Experience.tsx
      AIFocus.tsx
      Contact.tsx
  lib/
    github.functions.ts        (server fn: fetch + cache GitHub repos)
    lenis.ts                   (Lenis + ScrollTrigger sync)
    motion.ts                  (shared eases, variants)
    data/{experience.ts,skills.ts,featured.ts,profile.ts}
  hooks/{useMagnetic,useMousePosition,useReducedMotion,useAdaptiveQuality}.ts
  styles.css                   (extend tokens, glass utilities, noise bg)
public/
  resume.pdf                   (placeholder — replace with your real PDF)
  og.jpg                       (generated)
```

## GitHub data flow

`getGithubRepos` server function (TanStack `createServerFn`, GET) hits the public GitHub API, filters/sorts, returns a typed list. Called from the route loader via `queryClient.ensureQueryData`; component reads with `useSuspenseQuery`. Graceful empty/error state if rate-limited.

## Out of scope for this pass (call out explicitly)

- No backend email send (Contact uses mailto + validated form; can wire Resend/Cloud later).
- No CMS — content is in `src/lib/data/*`.
- Resume PDF is a placeholder file; you'll replace `public/resume.pdf`.
- Background music: mute-by-default toggle wired, but no audio file shipped (placeholder silent track) — drop your own `.mp3` into `public/ambient.mp3` if you want it active.

## Verification

After build: typecheck, load preview, screenshot hero + projects + contact via Playwright at 1280×1800 and at mobile width, confirm GitHub fetch returns repos and cards render, confirm no console errors, confirm reduced-motion fallback.
