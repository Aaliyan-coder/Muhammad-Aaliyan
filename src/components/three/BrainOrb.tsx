"use client";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Brain() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 2200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a wrinkled sphere — looks brain-ish
      const r =
        2 + Math.sin(i * 1.7) * 0.18 + Math.cos(i * 2.3) * 0.12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

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
      <pointsMaterial
        size={0.03}
        color="#9bd0ff"
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function BrainOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.6]}
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} color="#b495ff" intensity={1.2} />
      <Suspense fallback={null}>
        <Brain />
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom intensity={1.4} luminanceThreshold={0.1} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
