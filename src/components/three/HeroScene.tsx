"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";
import { NeuralNetwork } from "./NeuralNetwork";

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  useFrame(({ camera, pointer }, dt) => {
    target.current.x += (pointer.x * 0.6 - target.current.x) * 0.04;
    target.current.y += (-pointer.y * 0.4 - target.current.y) * 0.04;
    camera.position.x += (target.current.x - camera.position.x) * 0.05;
    camera.position.y += (target.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    // slow autonomous dolly
    const z = 8 + Math.sin(performance.now() * 0.0002) * 0.4;
    camera.position.z += (z - camera.position.z) * 0.02;
    // satisfy ts unused
    void dt;
  });
  return null;
}

function LightBeams() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.05;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i * Math.PI) / 4]}
          position={[0, 0, -2]}
        >
          <planeGeometry args={[0.6, 18]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#7cc7ff" : "#b495ff"}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene({ quality = 1 }: { quality?: number }) {
  return (
    <Canvas
      dpr={[1, Math.min(1.75, 1 + quality)]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#0a0c14"]} />
      <fog attach="fog" args={["#0a0c14", 8, 22]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#7cc7ff" />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#b495ff" />

      <PerformanceMonitor onIncline={() => {}} onDecline={() => {}}>
        <Suspense fallback={null}>
          <LightBeams />
          <ParticleField count={quality > 0.6 ? 1400 : 700} />
          <NeuralNetwork nodeCount={quality > 0.6 ? 40 : 24} radius={3.2} />
        </Suspense>
        <CameraRig />
        <AdaptiveDpr pixelated />
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </PerformanceMonitor>
    </Canvas>
  );
}
