"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated neural-network: nodes connected by lines, pulses traveling along edges.
 * Built once on mount; rotates slowly and ripples with sine waves.
 */
type Edge = { a: number; b: number; phase: number };

export function NeuralNetwork({
  nodeCount = 36,
  radius = 3.2,
}: {
  nodeCount?: number;
  radius?: number;
}) {
  const group = useRef<THREE.Group>(null);

  const { nodes, edges, lineGeometry, nodeGeometry } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const t = i / nodeCount;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      nodes.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ),
      );
    }

    // Connect each node to its nearest few neighbours
    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: nodes[i].distanceTo(n) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      for (const { j } of dists) {
        if (!edges.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
          edges.push({ a: i, b: j, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    const positions = new Float32Array(edges.length * 2 * 3);
    edges.forEach((e, i) => {
      positions.set([nodes[e.a].x, nodes[e.a].y, nodes[e.a].z], i * 6);
      positions.set([nodes[e.b].x, nodes[e.b].y, nodes[e.b].z], i * 6 + 3);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const nodeGeometry = new THREE.SphereGeometry(0.06, 12, 12);

    return { nodes, edges, lineGeometry, nodeGeometry };
  }, [nodeCount, radius]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#7cc7ff"),
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  const nodeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#b495ff"),
        transparent: true,
        opacity: 0.9,
      }),
    [],
  );

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.08;
      group.current.rotation.x += dt * 0.02;
    }
    // pulse opacity on shared line material
    const t = state.clock.elapsedTime;
    lineMat.opacity = 0.25 + Math.sin(t * 1.6) * 0.08;
  });

  return (
    <group ref={group}>
      <primitive object={new THREE.LineSegments(lineGeometry, lineMat)} />
      {nodes.map((n, i) => (
        <mesh key={i} position={n} geometry={nodeGeometry} material={nodeMat} />
      ))}
    </group>
  );
}
