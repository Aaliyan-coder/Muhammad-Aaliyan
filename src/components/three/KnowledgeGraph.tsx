"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { aiInterests } from "@/lib/data/profile";
import { SceneCanvas, useTier } from "./SceneCanvas";

function Graph({ labels }: { labels: boolean }) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);

  const nodes = useMemo(() => {
    return aiInterests.map((label, i) => {
      const t = i / aiInterests.length;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.2;
      return {
        label,
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
          r * Math.cos(phi),
        ),
      };
    });
  }, []);

  // Edges and their material are built once and disposed on unmount, rather
  // than being reallocated on every render.
  const { lines, lineMat } = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 4) {
          positions.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z,
          );
        }
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: "#7cc7ff",
      transparent: true,
      opacity: 0.25,
    });
    return { lines: new THREE.LineSegments(geom, lineMat), lineMat };
  }, [nodes]);

  useEffect(() => {
    const mesh = instances.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    nodes.forEach((n, i) => mesh.setMatrixAt(i, m.setPosition(n.position)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      lineMat.dispose();
    },
    [lines, lineMat],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.12;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
    lineMat.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.4) * 0.07;
  });

  return (
    <group ref={group}>
      <primitive object={lines} />
      <instancedMesh ref={instances} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#b495ff" />
      </instancedMesh>
      {labels &&
        nodes.map((n) => (
          <Billboard key={n.label} position={n.position}>
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
        ))}
    </group>
  );
}

export function KnowledgeGraph() {
  const tier = useTier();
  if (tier === null || tier === "off") return null;

  return (
    <SceneCanvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, tier === "high" ? 1.5 : 1]}
      gl={{ alpha: true, antialias: tier === "high", stencil: false }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} color="#7cc7ff" intensity={1.2} />
      <Suspense fallback={null}>
        <Graph labels={tier === "high"} />
      </Suspense>
    </SceneCanvas>
  );
}
