"use client";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { aiInterests } from "@/lib/data/profile";

type Node = {
  position: THREE.Vector3;
  label: string;
  base: THREE.Vector3;
};

function Graph() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo<Node[]>(() => {
    const labels = aiInterests;
    return labels.map((label, i) => {
      const t = i / labels.length;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.2;
      const v = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.7,
        r * Math.cos(phi),
      );
      return { position: v.clone(), label, base: v.clone() };
    });
  }, []);

  const edgeGeom = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 4) {
          positions.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z,
          );
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    return g;
  }, [nodes]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#7cc7ff",
        transparent: true,
        opacity: 0.25,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.12;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
    lineMat.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.4) * 0.07;
  });

  return (
    <group ref={group}>
      <primitive object={new THREE.LineSegments(edgeGeom, lineMat)} />
      {nodes.map((n, i) => (
        <group key={i} position={n.position}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#b495ff" />
          </mesh>
          <Billboard>
            <Text
              fontSize={0.22}
              color="#e6edf7"
              anchorX="center"
              anchorY="middle"
              position={[0, 0.42, 0]}
              outlineColor="#0a0c14"
              outlineWidth={0.01}
            >
              {n.label}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  );
}

export function KnowledgeGraph() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.6]}
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} color="#7cc7ff" intensity={1.2} />
      <Suspense fallback={null}>
        <Graph />
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom intensity={1.0} luminanceThreshold={0.2} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
