"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";
import { NeuralNetwork } from "./NeuralNetwork";
import { SceneCanvas, useTier } from "./SceneCanvas";

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  useFrame(({ camera, pointer, clock }) => {
    target.current.x += (pointer.x * 0.6 - target.current.x) * 0.04;
    target.current.y += (-pointer.y * 0.4 - target.current.y) * 0.04;
    camera.position.x += (target.current.x - camera.position.x) * 0.05;
    camera.position.y += (target.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    // slow autonomous dolly
    const z = 8 + Math.sin(clock.elapsedTime * 0.2) * 0.4;
    camera.position.z += (z - camera.position.z) * 0.02;
  });
  return null;
}

function LightBeams() {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.6, 18), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.05;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          geometry={geometry}
          rotation={[0, 0, (i * Math.PI) / 4]}
          position={[0, 0, -2]}
        >
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

export function HeroScene() {
  const tier = useTier();
  if (tier === null || tier === "off") return null;

  const high = tier === "high";

  return (
    <SceneCanvas
      dpr={[1, high ? 1.6 : 1]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{
        antialias: high,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
    >
      <color attach="background" args={["#0a0c14"]} />
      <fog attach="fog" args={["#0a0c14", 8, 22]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#7cc7ff" />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#b495ff" />

      <Suspense fallback={null}>
        <LightBeams />
        <ParticleField count={high ? 1100 : 450} />
        <NeuralNetwork nodeCount={high ? 36 : 18} radius={3.2} />
      </Suspense>
      <CameraRig />
      <AdaptiveDpr pixelated />

      {/* Post-processing is the single most expensive thing in this scene, so
          it is reserved for the hero and only on hardware that can take it. */}
      {high && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      )}
    </SceneCanvas>
  );
}
