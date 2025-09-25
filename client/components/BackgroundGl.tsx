"use client";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React from "react";

function AnimatedMesh() {
  const ref = React.useRef<any>();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.05;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]} scale={1.6}>
      <icosahedronGeometry args={[1.6, 2]} />
      <MeshWobbleMaterial factor={0.6} speed={1.2} color={`#60a5fa`} envMapIntensity={0.5} />
    </mesh>
  );
}

export default function BackgroundGl() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <AnimatedMesh />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
