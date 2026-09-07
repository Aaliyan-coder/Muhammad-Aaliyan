"use client";
import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas, useTier } from "./SceneCanvas";

function Brain({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a wrinkled sphere — looks brain-ish
      const r = 2 + Math.sin(i * 1.7) * 0.18 + Math.cos(i * 2.3) * 0.12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.18;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Additive blending gives the glow that Bloom used to, for free. */}
      <pointsMaterial
        size={0.035}
        color="#9bd0ff"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function BrainOrb() {
  const tier = useTier();
  if (tier === null || tier === "off") return null;

  return (
    <SceneCanvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, tier === "high" ? 1.5 : 1]}
      gl={{ alpha: true, antialias: false, stencil: false, depth: false }}
    >
      <Suspense fallback={null}>
        <Brain count={tier === "high" ? 1800 : 700} />
      </Suspense>
    </SceneCanvas>
  );
}
