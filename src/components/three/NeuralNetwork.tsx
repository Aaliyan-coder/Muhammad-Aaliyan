"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated neural-network: nodes connected by lines, pulsing slowly.
 *
 * Nodes are drawn as a single InstancedMesh (one draw call for the whole
 * network instead of one per node) and the edge LineSegments object is built
 * once and disposed on unmount.
 */
export function NeuralNetwork({
  nodeCount = 36,
  radius = 3.2,
}: {
  nodeCount?: number;
  radius?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);

  const { nodes, lines, lineMat } = useMemo(() => {
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

    // Connect each node to its three nearest neighbours.
    const seen = new Set<string>();
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const nearest = nodes
        .map((n, j) => ({ j, d: nodes[i].distanceTo(n) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      for (const { j } of nearest) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        positions.push(
          nodes[i].x, nodes[i].y, nodes[i].z,
          nodes[j].x, nodes[j].y, nodes[j].z,
        );
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#7cc7ff"),
      transparent: true,
      opacity: 0.3,
    });

    return { nodes, lines: new THREE.LineSegments(lineGeometry, lineMat), lineMat };
  }, [nodeCount, radius]);

  // Seed the instance matrices once.
  useEffect(() => {
    const mesh = instances.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    nodes.forEach((n, i) => mesh.setMatrixAt(i, m.setPosition(n)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      lineMat.dispose();
    },
    [lines, lineMat],
  );

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.08;
      group.current.rotation.x += dt * 0.02;
    }
    lineMat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
  });

  return (
    <group ref={group}>
      <primitive object={lines} />
      <instancedMesh ref={instances} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#b495ff" transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}
