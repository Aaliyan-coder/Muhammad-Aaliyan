"use client";
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { flatSkills } from "@/lib/data/skills";

function Orb({
  position,
  label,
  baseY,
  index,
}: {
  position: [number, number, number];
  label: string;
  baseY: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = baseY + Math.sin(t * 0.8 + index) * 0.18;
    ref.current.rotation.y = t * 0.2 + index;
  });
  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={hover ? "#b495ff" : "#7cc7ff"}
          emissive={hover ? "#b495ff" : "#284a78"}
          emissiveIntensity={hover ? 1.2 : 0.4}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.78, 0]}
          outlineColor="#0a0c14"
          outlineWidth={0.012}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function Cluster() {
  const skills = flatSkills.slice(0, 22);
  const positions = useMemo(() => {
    return skills.map((_, i) => {
      const t = i / skills.length;
      const angle = t * Math.PI * 2 * 1.7;
      const ring = i % 3;
      const r = 3 + ring * 0.6;
      const y = (ring - 1) * 0.8;
      return {
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [
          number,
          number,
          number,
        ],
        baseY: y,
      };
    });
  }, [skills.length]);

  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.1;
  });

  return (
    <group ref={group}>
      {skills.map((s, i) => (
        <Orb
          key={s}
          label={s}
          index={i}
          position={positions[i].pos}
          baseY={positions[i].baseY}
        />
      ))}
      {/* central core */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#0a0c14"
          emissive="#7cc7ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={1}
        />
      </mesh>
    </group>
  );
}

export function SkillsOrbit() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 8], fov: 50 }}
      dpr={[1, 1.6]}
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} color="#7cc7ff" intensity={1.5} />
      <pointLight position={[-5, -5, -5]} color="#b495ff" intensity={1} />
      <Suspense fallback={null}>
        <Cluster />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={0.9} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
