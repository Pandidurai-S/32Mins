'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/models/32Mins_model_male_01.glb');
  return <primitive object={scene} scale={1} rotation={[0, Math.PI / 2, 0]} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [5, 2, 0], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
} 