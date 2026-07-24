"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

interface Props {
  model: string;
}
function Loader() {
  return null;
}

function Model({ model }: Props) {
  const { scene } = useGLTF(model);

  return <primitive object={scene} />;
}

export default function ModelViewer({ model }: Props) {
  return (
    <Canvas shadows>
      <color attach="background" args={["#edf2f7"]} />
      <hemisphereLight intensity={1} />

      <directionalLight castShadow position={[10, 10, 5]} intensity={3} />

      <Suspense fallback={<Loader />}>
        <Stage
          shadows="contact"
          adjustCamera
          environment="city"
          intensity={0.5}
        >
          <Model model={model} />
        </Stage>
      </Suspense>

      <Environment preset="city" />

      <OrbitControls
        autoRotate={false}
        autoRotateSpeed={1}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
      />
    </Canvas>
  );
}
