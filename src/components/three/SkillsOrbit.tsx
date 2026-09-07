"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { flatSkills } from "@/lib/data/skills";
import { SceneCanvas, useTier } from "./SceneCanvas";

function Orb({
  position,
  label,
  baseY,
  index,
  geometry,
  labels,
}: {
  position: [number, number, number];
  label: string;
  baseY: number;
  index: number;
  geometry: THREE.BufferGeometry;
  labels: boolean;
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
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={hover ? "#b495ff" : "#7cc7ff"}
          emissive={hover ? "#b495ff" : "#284a78"}
          emissiveIntensity={hover ? 1.4 : 0.6}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      {labels && (
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
      )}
    </group>
  );
}

function Cluster({ count, labels }: { count: number; labels: boolean }) {
  const skills = useMemo(() => flatSkills.slice(0, count), [count]);

  const positions = useMemo(
    () =>
      skills.map((_, i) => {
        const t = i / skills.length;
        const angle = t * Math.PI * 2 * 1.7;
        const ring = i % 3;
        const r = 3 + ring * 0.6;
        const y = (ring - 1) * 0.8;
        return {
          pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
          baseY: y,
        };
      }),
    [skills],
  );

  // One geometry shared by every orb instead of one per orb.
  const orbGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.42, 0), []);
  useEffect(() => () => orbGeometry.dispose(), [orbGeometry]);

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
          geometry={orbGeometry}
          labels={labels}
          position={positions[i].pos}
          baseY={positions[i].baseY}
        />
      ))}
      {/* central core */}
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial
          color="#0a0c14"
          emissive="#7cc7ff"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={1}
        />
      </mesh>
    </group>
  );
}

export function SkillsOrbit() {
  const tier = useTier();
  if (tier === null || tier === "off") return null;

  const high = tier === "high";

  return (
    <SceneCanvas
      camera={{ position: [0, 1.5, 8], fov: 50 }}
      dpr={[1, high ? 1.5 : 1]}
      gl={{ alpha: true, antialias: high, stencil: false }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} color="#7cc7ff" intensity={1.5} />
      <pointLight position={[-5, -5, -5]} color="#b495ff" intensity={1} />
      <Suspense fallback={null}>
        <Cluster count={high ? 22 : 12} labels={high} />
      </Suspense>
    </SceneCanvas>
  );
}
