import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function Particles({ count = 500 }) {
  const mesh = useRef();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
      mesh.current.rotation.x += 0.001;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ff69b4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CustomModel({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={[2, 2, 2]} />;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ff69b4" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
    </>
  );
}

export default function RoseScene() {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-black to-[#1a1a1a]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 6, 5]} />
        <Lights />
        <CustomModel url="src\models\rosee.glb" />
        <Particles />
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <EffectComposer>
          <Bloom
        intensity={2.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        height={300}
          />
        </EffectComposer>
      </Canvas>
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-slow-fade">
        <h1 className="text-4xl font-bold text-pink-200 opacity-80 drop-shadow-lg">
          I Love You
        </h1>
        <p className="text-pink-300 mt-2 opacity-60 drop-shadow-md">
          Gulaabay Hayaat
        </p>
      </div>
      <style jsx>{`
        @keyframes slow-fade {
          0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-50%);
          }
          50% {
        opacity: 1;
        transform: translateX(-50%) translateY(-50%);
          }
          100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-50%);
          }
        }
        .animate-slow-fade {
          animation: slow-fade 10s infinite;
        }
      `}</style>
    </div>
  );
}