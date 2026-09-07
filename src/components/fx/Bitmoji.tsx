"use client";
import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// The intro has to seed its starting transform before the browser paints,
// otherwise the portrait flashes at full size for a frame first.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Illustrated portrait of Aaliyan — navy suit, white shirt, trimmed beard.
 *
 * Inline SVG rather than a raster image: crisp at any size, a couple of
 * kilobytes, no network request. Head-and-shoulders framing, which reads
 * better at portfolio scale than a full-length figure.
 *
 * Layout (viewBox units): crown 24 · hairline 95 · brows 130 · eyes 160 ·
 * nose 186 · mouth 210 · chin 248 · collar 284.
 */
export function Bitmoji({
  className,
  float = true,
  variant = "full",
  src,
}: {
  className?: string;
  float?: boolean;
  /** "full" is head, shoulders and chest; "bust" crops tight to the head. */
  variant?: "full" | "bust";
  /**
   * Optional image to render instead of the drawing — point this at a real
   * Bitmoji/avatar export in `public/` and it takes over everywhere at once.
   */
  src?: string;
}) {
  // Gradient ids must be unique per instance, or a second avatar on the page
  // would silently reuse the first one's paint servers.
  const uid = useId().replace(/:/g, "");
  const full = variant === "full";

  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const irisLRef = useRef<SVGGElement>(null);
  const irisRRef = useRef<SVGGElement>(null);
  const blinkLRef = useRef<SVGGElement>(null);
  const blinkRRef = useRef<SVGGElement>(null);

  /**
   * Three behaviours, one animation loop:
   *   · an entrance the first time he scrolls into view — he grows up out of
   *     the collar with his eyes shut, then opens them;
   *   · eyes that follow the pointer;
   *   · blinking on a randomised timer.
   *
   * Written to stay cheap: nothing here goes through React state, so no frame
   * causes a re-render. Transforms are written straight onto a handful of <g>
   * elements, the loop stops as soon as everything settles (blinks restart it
   * via a timer), and the whole thing is suspended while the avatar is
   * off-screen or the tab is in the background.
   */
  useIsomorphicLayoutEffect(() => {
    if (src) return;
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const irises = [irisLRef.current, irisRRef.current].filter(Boolean) as SVGGElement[];
    const lids = [blinkLRef.current, blinkRRef.current].filter(Boolean) as SVGGElement[];
    const head = headRef.current;

    const EYE_Y = 160; // blink scales about the eye line
    const NECK_X = 160; // entrance scales about the base of the neck, so the
    const NECK_Y = 250; // chin stays planted on the collar and he grows upward
    const BLINK_MS = 160;
    const INTRO_MS = 820;
    const LID_SHUT = 0.06;

    let raf = 0;
    let blinkTimer = 0;
    let box: DOMRect | null = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let blinkStart = 0;
    let introStart = 0;
    let introDone = false;
    let active = false;

    // Slight overshoot so he lands with a little pop rather than easing flat.
    const easeOutBack = (p: number) => {
      const c1 = 1.15;
      const q = p - 1;
      return 1 + (c1 + 1) * q * q * q + c1 * q * q;
    };
    const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

    const setLids = (k: number) => {
      const shift = (EYE_Y * (1 - k)).toFixed(2);
      for (const g of lids) {
        g.setAttribute("transform", `translate(0 ${shift}) scale(1 ${k.toFixed(3)})`);
      }
    };

    const setHead = (dx: number, dy: number, scale: number) => {
      if (!head) return;
      let t = `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`;
      if (scale !== 1) {
        t += ` translate(${NECK_X} ${NECK_Y}) scale(${scale.toFixed(4)}) translate(${-NECK_X} ${-NECK_Y})`;
      }
      head.setAttribute("transform", t);
    };

    const start = () => {
      if (!raf && active) raf = requestAnimationFrame(frame);
    };

    const scheduleBlink = () => {
      window.clearTimeout(blinkTimer);
      blinkTimer = window.setTimeout(
        () => {
          if (!active) return;
          blinkStart = performance.now();
          start();
        },
        2600 + Math.random() * 4200,
      );
    };

    function frame(now: number) {
      raf = 0;

      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      let busy = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002;

      let scale = 1;
      let lidOverride = -1;

      if (introStart) {
        const p = Math.min(1, (now - introStart) / INTRO_MS);
        scale = 0.88 + easeOutBack(p) * 0.12;
        // Eyes stay shut through the rise, then open over the last third.
        const op = (p - 0.46) / 0.34;
        lidOverride =
          op <= 0 ? LID_SHUT : op >= 1 ? -1 : LID_SHUT + (1 - LID_SHUT) * easeOutCubic(op);
        if (p >= 1) {
          introStart = 0;
          introDone = true;
          scale = 1;
          lidOverride = -1;
          scheduleBlink();
        } else {
          busy = true;
        }
      }

      setHead(cx * 2.2, cy * 1.4, scale);
      const ix = (cx * 3.4).toFixed(2);
      const iy = (cy * 2.6).toFixed(2);
      for (const g of irises) g.setAttribute("transform", `translate(${ix} ${iy})`);

      if (lidOverride >= 0) {
        setLids(lidOverride);
      } else if (blinkStart) {
        const p = (now - blinkStart) / BLINK_MS;
        if (p >= 1) {
          blinkStart = 0;
          for (const g of lids) g.removeAttribute("transform");
          scheduleBlink();
        } else {
          // 1 → ~0.08 → 1 over the blink, scaled about the eye line.
          setLids(1 - Math.sin(p * Math.PI) * 0.92);
          busy = true;
        }
      } else {
        for (const g of lids) g.removeAttribute("transform");
      }

      if (busy) raf = requestAnimationFrame(frame);
    }

    // Seed the pre-entrance pose now, before the first paint.
    const seedIntro = () => {
      setHead(0, 0, 0.88);
      setLids(LID_SHUT);
    };
    seedIntro();

    const onMove = (e: MouseEvent) => {
      if (!active) return;
      if (!box) box = svg.getBoundingClientRect();
      if (!box.width) return;
      // Anchor on the eye line rather than the box centre.
      const ax = box.left + box.width / 2;
      const ay = box.top + box.height * 0.4;
      const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
      tx = clamp((e.clientX - ax) / (box.width * 1.5));
      ty = clamp((e.clientY - ay) / (box.height * 1.1));
      start();
    };

    const invalidate = () => {
      box = null;
    };

    const suspend = () => {
      window.clearTimeout(blinkTimer);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      // Scrolled away mid-entrance: rewind so it plays properly next time
      // rather than snapping to the end.
      if (introStart) {
        introStart = 0;
        seedIntro();
      }
    };

    const sync = (visible: boolean) => {
      active = visible && !document.hidden;
      if (active) {
        box = null;
        if (introDone) scheduleBlink();
        else introStart = performance.now();
        start();
      } else {
        suspend();
      }
    };

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync(inView);
      },
      // Fire once he is meaningfully on screen, so the entrance is not half
      // over by the time it is actually visible.
      { threshold: 0.2 },
    );
    io.observe(svg);

    const onVisibility = () => sync(inView);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      suspend();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  if (src) {
    return (
      <img
        src={src}
        alt="Portrait of Aaliyan Arif"
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-contain", float && "animate-float", className)}
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={full ? "0 0 320 380" : "80 16 160 244"}
      role="img"
      aria-label="Illustrated portrait of Aaliyan Arif in a navy suit"
      className={cn("h-full w-full", float && "animate-float", className)}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#f2c69d" />
          <stop offset="55%" stopColor="#e0a774" />
          <stop offset="100%" stopColor="#c48a56" />
        </linearGradient>
        <linearGradient id={`${uid}-hair`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#4a3427" />
          <stop offset="45%" stopColor="#28190f" />
          <stop offset="100%" stopColor="#150d07" />
        </linearGradient>
        <linearGradient id={`${uid}-beard`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3d2b1e" />
          <stop offset="55%" stopColor="#241710" />
          <stop offset="100%" stopColor="#150d08" />
        </linearGradient>
        <linearGradient id={`${uid}-suit`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#2f4670" />
          <stop offset="50%" stopColor="#1c2c48" />
          <stop offset="100%" stopColor="#0f1a2c" />
        </linearGradient>
        <linearGradient id={`${uid}-lapel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a5280" />
          <stop offset="100%" stopColor="#1a2942" />
        </linearGradient>
        <linearGradient id={`${uid}-shirt`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d5dfee" />
        </linearGradient>
        <linearGradient id={`${uid}-tie`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#24375a" />
          <stop offset="100%" stopColor="#0d1728" />
        </linearGradient>
        <radialGradient id={`${uid}-iris`} cx="42%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8a5a33" />
          <stop offset="60%" stopColor="#5b3a1e" />
          <stop offset="100%" stopColor="#2e1c0e" />
        </radialGradient>
        <clipPath id={`${uid}-clipL`}>
          <path d="M122 160 C127 150 145 150 150 160 C145 170 127 170 122 160 Z" />
        </clipPath>
        <clipPath id={`${uid}-clipR`}>
          <path d="M170 160 C175 150 193 150 198 160 C193 170 175 170 170 160 Z" />
        </clipPath>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="36%" r="58%">
          <stop offset="0%" stopColor="oklch(0.82 0.13 220)" stopOpacity="0.24" />
          <stop offset="55%" stopColor="oklch(0.70 0.16 290)" stopOpacity="0.09" />
          <stop offset="100%" stopColor="oklch(0.70 0.16 290)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {full && <ellipse cx="160" cy="185" rx="150" ry="172" fill={`url(#${uid}-halo)`} />}

      {/*
        Everything below shares one collar geometry, so the pieces cannot drift
        apart: the jacket opening runs from (132,262) and (188,262) down to a
        button point below the frame, passing through x=153 and x=167 at y=380.
        Shirt, tie and lapels are all cut against those same two edges.
      */}

      {/* Neck — kept inside x 132-188 so the collar can cover it completely */}
      <path d="M142 220 L178 220 L184 296 L136 296 Z" fill="#7c4c22" />
      <path d="M142 220 C147 254 173 254 178 220 L182 254 C173 272 147 272 138 254 Z" fill="#573212" opacity="0.95" />

      {/* Jacket — solid; the shirt on top forms the opening */}
      <path
        d="M40 380 C42 324 58 292 88 280 C104 272 120 266 132 262 L188 262 C200 266 216 272 232 280 C262 292 278 324 280 380 Z"
        fill={`url(#${uid}-suit)`}
      />

      {/* Shirt — fills the collar opening exactly */}
      <path d="M132 262 L145 380 L175 380 L188 262 Z" fill={`url(#${uid}-shirt)`} />
      <path d="M132 262 L160 292 L147 303 Z" fill="#c7d3e5" />
      <path d="M188 262 L160 292 L173 303 Z" fill="#eaf0f7" />

      {/* Tie — knot and blade both sit inside the opening */}
      <path d="M150 291 L170 291 L175 309 L145 309 Z" fill={`url(#${uid}-tie)`} />
      <path d="M146 309 L174 309 L169 380 L151 380 Z" fill={`url(#${uid}-tie)`} />
      <path d="M160 309 L160 380" stroke="#41567d" strokeWidth="1.2" opacity="0.3" />
      <path d="M150 291 L170 291" stroke="#41567d" strokeWidth="1.4" opacity="0.35" />

      {/* Lapels — inner edge is the collar opening, outer edge flares to the shoulder */}
      <path d="M132 262 L145 380 L112 380 L96 288 Z" fill={`url(#${uid}-lapel)`} />
      <path d="M188 262 L175 380 L208 380 L224 288 Z" fill="#1b2b46" />
      <path
        d="M132 262 L145 380 M188 262 L175 380"
        stroke="#56709c"
        strokeWidth="1.2"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M96 288 L112 380 M224 288 L208 380"
        stroke="#41567d"
        strokeWidth="1.4"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Head — this whole group drifts a little toward the pointer */}
      <g ref={headRef}>
      {/* Ears */}
      <ellipse cx="97" cy="166" rx="13" ry="21" fill="#d79a67" />
      <ellipse cx="223" cy="166" rx="13" ry="21" fill="#d79a67" />
      <ellipse cx="98" cy="166" rx="6" ry="11" fill="#aa6c3a" opacity="0.55" />
      <ellipse cx="222" cy="166" rx="6" ry="11" fill="#aa6c3a" opacity="0.55" />

      {/* Face */}
      <path
        d="M96 156 C96 102 122 70 160 70 C198 70 224 102 224 156 C224 194 214 224 194 238 C184 245 173 248 160 248 C147 248 136 245 126 238 C106 224 96 194 96 156 Z"
        fill={`url(#${uid}-skin)`}
      />
      <path
        d="M96 156 C96 194 106 224 126 238 C116 222 107 192 106 156 Z"
        fill="#c68352"
        opacity="0.3"
      />
      <path
        d="M224 156 C224 194 214 224 194 238 C204 222 213 192 214 156 Z"
        fill="#aa6c3a"
        opacity="0.35"
      />
      {/* Shadow the hair casts on the brow */}
      <path
        d="M102 116 C118 100 138 94 160 94 C182 94 202 100 218 116 C202 108 182 104 160 104 C138 104 118 108 102 116 Z"
        fill="#aa6c3a"
        opacity="0.3"
      />

      {/* Trimmed full beard, with sideburns joining it to the hair */}
      <path
        d="M97 132 C96 175 106 216 126 238 C136 245 147 248 160 248 C173 248 184 245 194 238 C214 216 224 175 223 132 C220 156 214 172 204 182 C196 190 180 195 160 195 C140 195 124 190 116 182 C106 172 100 156 97 132 Z"
        fill={`url(#${uid}-beard)`}
      />
      <path
        d="M114 208 C130 224 190 224 206 208"
        stroke="#4a3527"
        strokeWidth="2"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />
      <path
        d="M124 226 C140 238 180 238 196 226"
        stroke="#4a3527"
        strokeWidth="1.6"
        fill="none"
        opacity="0.28"
        strokeLinecap="round"
      />

      {/* Mouth — closed, easy smile */}
      <path d="M145 213 C152 219 168 219 175 213 C168 222 152 222 145 213 Z" fill="#bd7361" opacity="0.85" />
      <path
        d="M143 210 C152 217 168 217 177 210"
        stroke="#5e3226"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      {/*
        No separate moustache shape. On a full beard the upper lip is simply
        part of the beard — a distinct blob sitting on the face reads as a
        stick-on prop. A soft parting line is all the definition it needs.
      */}
      <path
        d="M140 199 C148 194 154 197 160 200 C166 197 172 194 180 199"
        stroke="#4a3527"
        strokeWidth="1.6"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Nose */}
      <path d="M160 150 C153 172 150 182 160 186 C170 182 167 172 160 150" fill="#bb7845" opacity="0.4" />
      <ellipse cx="160" cy="180" rx="5.5" ry="4" fill="#f3c99f" opacity="0.3" />
      <ellipse cx="152" cy="184" rx="3" ry="2.2" fill="#95602f" opacity="0.55" />
      <ellipse cx="168" cy="184" rx="3" ry="2.2" fill="#95602f" opacity="0.55" />

      {/*
        Each eye is its own group so it can be scaled about the eye line to
        blink; the iris group inside is translated to track the pointer and is
        clipped to the sclera so it can never slide outside the eye.
      */}
      <g ref={blinkLRef}>
        <path d="M122 160 C127 150 145 150 150 160 C145 170 127 170 122 160 Z" fill="#f7f3ee" />
        <g clipPath={`url(#${uid}-clipL)`}>
          <g ref={irisLRef}>
            <circle cx="136" cy="161" r="7.6" fill={`url(#${uid}-iris)`} />
            <circle cx="136" cy="161" r="3.4" fill="#150d06" />
            <circle cx="132.5" cy="157" r="2.3" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
        <path
          d="M122 160 C127 150 145 150 150 160"
          stroke="#2c1a10"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g ref={blinkRRef}>
        <path d="M170 160 C175 150 193 150 198 160 C193 170 175 170 170 160 Z" fill="#f7f3ee" />
        <g clipPath={`url(#${uid}-clipR)`}>
          <g ref={irisRRef}>
            <circle cx="184" cy="161" r="7.6" fill={`url(#${uid}-iris)`} />
            <circle cx="184" cy="161" r="3.4" fill="#150d06" />
            <circle cx="180.5" cy="157" r="2.3" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
        <path
          d="M170 160 C175 150 193 150 198 160"
          stroke="#2c1a10"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Lid creases */}
      <path
        d="M124 151 C130 144 144 144 150 151 M196 151 C190 144 176 144 170 151"
        stroke="#bb7845"
        strokeWidth="1.8"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />

      {/* Eyebrows */}
      <path d="M113 147 C118 132 140 126 156 135 C154 141 149 140 141 139 C129 138 118 141 114 149 Z" fill="#241710" />
      <path d="M207 147 C202 132 180 126 164 135 C166 141 171 140 179 139 C191 138 202 141 206 149 Z" fill="#241710" />

      {/* Hair — hairline dips at the temples so the brow reads narrow */}
      <path
        d="M94 166 C87 130 90 80 120 58 C142 42 182 40 204 54 C232 72 235 128 230 166 C228 150 224 134 218 118 C206 102 188 95 160 95 C132 95 114 102 102 118 C96 132 95 150 94 166 Z"
        fill={`url(#${uid}-hair)`}
      />
      {/* Side-swept volume across the crown */}
      <path
        d="M110 74 C126 52 158 41 187 50 C201 55 209 65 212 78 C196 61 172 57 151 66 C134 73 118 79 110 74 Z"
        fill="#43301f"
        opacity="0.55"
      />
      <path
        d="M120 60 C139 47 168 43 193 54"
        stroke="#5e442d"
        strokeWidth="4"
        fill="none"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M105 94 C115 75 136 62 159 60"
        stroke="#5e442d"
        strokeWidth="3"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
      />
      <path
        d="M218 80 C225 98 229 124 230 146"
        stroke="#5e442d"
        strokeWidth="2.6"
        fill="none"
        opacity="0.22"
        strokeLinecap="round"
      />
      </g>
    </svg>
  );
}
