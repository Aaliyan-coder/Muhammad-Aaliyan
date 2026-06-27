"use client";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import { MagneticButton } from "@/components/fx/Magnetic";
import { profile } from "@/lib/data/profile";

const HeroScene = lazy(() =>
  import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
);

export function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % profile.roles.length),
      2800,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Defer scene mount until after first paint to keep LCP fast
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setSceneReady(true))
      : window.setTimeout(() => setSceneReady(true), 200);
    return () => {
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* 3D background */}
      <div className="absolute inset-0">
        {sceneReady && (
          <Suspense fallback={null}>
            <HeroScene quality={1} />
          </Suspense>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]"
        />
      </div>

      {/* Audio toggle */}
      <button
        onClick={() => {
          setMuted((m) => {
            const next = !m;
            if (audioRef.current) {
              audioRef.current.muted = next;
              if (!next) audioRef.current.play().catch(() => {});
            }
            return next;
          });
        }}
        aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
        className="glass absolute right-6 top-24 z-10 hidden rounded-full p-2.5 text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <audio
        ref={audioRef}
        src="/ambient.mp3"
        loop
        muted
        preload="none"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3 w-3 text-cyan" />
          Available for new opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(3rem,9vw,7.5rem)] font-light leading-[0.95] tracking-[-0.04em]"
        >
          <span className="block">{profile.name.split(" ")[0]}</span>
          <span className="block text-gradient">{profile.name.split(" ")[1]}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-8 flex h-7 items-center gap-3 text-base text-muted-foreground sm:text-lg"
        >
          <span aria-hidden className="h-px w-10 bg-gradient-to-r from-cyan/60 to-transparent" />
          <span className="relative inline-block min-w-[18ch]">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                {profile.roles[roleIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <MagneticButton onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View selected work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Get in touch
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span>Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 block h-4 bg-gradient-to-b from-cyan to-transparent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
