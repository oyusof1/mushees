
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const Mushroom = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => {
  const mushroomRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (mushroomRef.current) {
      mushroomRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      mushroomRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={mushroomRef} position={position} scale={scale}>
        {/* Mushroom stem */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
          <meshStandardMaterial 
            color="#F8F8FF" 
            emissive="#8B5CF6"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Mushroom cap */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* Mushroom spots */}
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(i * 0.8) * 0.3,
              0.4,
              Math.sin(i * 0.8) * 0.3
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

export const MushroomGroup = () => {
  const mushroomConfigs = [
    { position: [0, 0, 0] as [number, number, number], scale: 1.5, color: "#8B5CF6" },
    { position: [-3, -1, 2] as [number, number, number], scale: 1, color: "#EC4899" },
    { position: [3, -0.5, 1] as [number, number, number], scale: 1.2, color: "#06B6D4" },
    { position: [-2, 1, -2] as [number, number, number], scale: 0.8, color: "#F59E0B" },
    { position: [2, 0.5, -3] as [number, number, number], scale: 1.1, color: "#10B981" },
    { position: [0, -2, 3] as [number, number, number], scale: 0.9, color: "#8B5CF6" },
    { position: [-4, 0, -1] as [number, number, number], scale: 0.7, color: "#EC4899" },
    { position: [4, -1, 2] as [number, number, number], scale: 1.3, color: "#06B6D4" },
  ];

  return (
    <>
      {mushroomConfigs.map((config, index) => (
        <Mushroom
          key={index}
          position={config.position}
          scale={config.scale}
          color={config.color}
        />
      ))}
    </>
  );
};
