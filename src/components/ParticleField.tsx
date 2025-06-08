
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleField = () => {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      // Random positions
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      // Random colors (psychedelic palette)
      const colorChoice = Math.random();
      if (colorChoice < 0.25) {
        colors[i * 3] = 0.545; colors[i * 3 + 1] = 0.361; colors[i * 3 + 2] = 0.965; // Purple
      } else if (colorChoice < 0.5) {
        colors[i * 3] = 0.925; colors[i * 3 + 1] = 0.286; colors[i * 3 + 2] = 0.600; // Pink
      } else if (colorChoice < 0.75) {
        colors[i * 3] = 0.024; colors[i * 3 + 1] = 0.714; colors[i * 3 + 2] = 0.831; // Cyan
      } else {
        colors[i * 3] = 0.965; colors[i * 3 + 1] = 0.620; colors[i * 3 + 2] = 0.043; // Gold
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Animate particles
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};
