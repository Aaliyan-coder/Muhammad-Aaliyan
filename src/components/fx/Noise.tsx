export function Noise() {
  return (
    <div
      aria-hidden
      className="noise-overlay pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
    />
  );
}

/**
 * Ambient colour wash behind the page.
 *
 * Painted with radial-gradients rather than blurred elements: three
 * `blur-[140px]` boxes covering most of the viewport force the compositor to
 * re-rasterize an enormous area, which is one of the cheapest scroll-jank
 * wins to give back.
 */
export function GradientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: [
          "radial-gradient(60vw 55vh at 50% -5%, oklch(0.82 0.13 220 / 0.10), transparent 70%)",
          "radial-gradient(50vw 45vh at 105% 100%, oklch(0.70 0.16 290 / 0.10), transparent 70%)",
          "radial-gradient(40vw 40vh at -5% 55%, oklch(0.82 0.13 220 / 0.08), transparent 70%)",
        ].join(","),
      }}
    />
  );
}
