import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for psychedelic gradient effect
const psychedelicVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const psychedelicFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    // Create gradient based on position and normal
    float gradient = (vPosition.y + 1.0) * 0.5; // Vertical gradient
    float radial = length(vPosition.xz) * 0.2; // Radial component
    
    // Add time-based animation
    float hueOffset = gradient + radial + time * 0.05;
    
    // Use cooler, more harmonious color range
    // Focus on purples, blues, cyans, and magentas
    float hue = 0.6 + sin(hueOffset * 2.0) * 0.25; // Range from ~0.35 to ~0.85 (blue to purple spectrum)
    hue = fract(hue); // Keep hue in 0-1 range
    
    // Create psychedelic colors with better saturation control
    float saturation = 0.7 + 0.2 * sin(vPosition.y * 2.0 + time);
    float brightness = 0.6 + 0.3 * sin(vPosition.y * 4.0 + time * 1.5);
    
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    
    // Add subtle glow effect
    float glow = 1.0 + 0.3 * sin(time * 2.0);
    color *= glow;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const Spore = ({ index, mushroomPosition }: { index: number, mushroomPosition: [number, number, number] }) => {
  const sporeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sporeRef.current) {
      const time = state.clock.elapsedTime;
      sporeRef.current.position.set(
        mushroomPosition[0] + Math.cos(index * 0.5) * (1.2 + Math.sin(time * 2 + index) * 0.3),
        mushroomPosition[1] + 0.3 + Math.sin(time * 3 + index) * 0.2,
        mushroomPosition[2] + Math.sin(index * 0.5) * (1.2 + Math.cos(time * 2 + index) * 0.3)
      );
      
      // Animate spore color - use harmonious purple/blue range
      const hue = 0.6 + Math.sin(time * 0.5 + index * 0.2) * 0.25; // Purple to cyan range
      (sporeRef.current.material as THREE.MeshStandardMaterial).color.setHSL(hue, 0.8, 0.7);
    }
  });
  
  return (
    <mesh ref={sporeRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial 
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.6}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const Mushroom = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => {
  const mushroomRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  
  // Create custom shader material
  const capMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: psychedelicVertexShader,
      fragmentShader: psychedelicFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(color) }
      }
    });
  }, [color]);
  
  const stemMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: psychedelicVertexShader,
      fragmentShader: psychedelicFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#F5F5DC') }
      }
    });
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update shader uniforms
    capMaterial.uniforms.time.value = time;
    stemMaterial.uniforms.time.value = time;
    
    if (mushroomRef.current) {
      // Gentle floating and rotation
      mushroomRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      mushroomRef.current.position.y = position[1] + Math.sin(time * 0.3 + position[0]) * 0.3;
    }
    
    if (capRef.current) {
      // Psychedelic cap morphing - breathing effect
      const breathe = 1 + Math.sin(time * 2 + position[0]) * 0.1;
      capRef.current.scale.setScalar(breathe);
      
      // Color shifting for cap
      const hue = 0.6 + Math.sin(time * 0.1 + position[0] * 0.1) * 0.25;
      const saturation = 0.8 + Math.sin(time * 3) * 0.2;
      const lightness = 0.6 + Math.sin(time * 2.5) * 0.2;
      (capRef.current.material as THREE.MeshStandardMaterial).color.setHSL(hue, saturation, lightness);
      (capRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2;
    }
    
    if (stemRef.current) {
      // Stem swaying
      stemRef.current.rotation.z = Math.sin(time * 1.5 + position[0]) * 0.1;
      
      // Subtle color shift for stem
      const stemHue = 0.6 + Math.sin(time * 0.05 + position[0] * 0.05) * 0.15;
      (stemRef.current.material as THREE.MeshStandardMaterial).color.setHSL(stemHue, 0.5, 0.7);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={mushroomRef} position={position} scale={scale}>
        {/* Mushroom stem - main shaft */}
        <mesh ref={stemRef} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.6, 32]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        
        {/* Mushroom cap - proper dome shape (hemisphere only) */}
        <mesh ref={capRef} position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
        
        {/* Cap underside - flat circular base with natural gill color */}
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.02, 64]} />
          <meshStandardMaterial 
            color="#D2B48C"
            emissive="#D2B48C"
            emissiveIntensity={0.05}
            roughness={0.9}
          />
        </mesh>
        
        {/* Glowing underside with natural color */}
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.01, 32]} />
          <meshStandardMaterial 
            color="#CD853F"
            emissive="#CD853F"
            emissiveIntensity={0.1}
            roughness={0.95}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Psychedelic spores/particles */}
      {[...Array(8)].map((_, i) => (
        <Spore key={i} index={i} mushroomPosition={position} />
      ))}
    </Float>
  );
};

export const MushroomGroup = () => {
  const mushroomConfigs = [
    // Original center cluster - spread out more
    { position: [0, 0, 0] as [number, number, number], scale: 1.5, color: "#8B5CF6" },
    { position: [-5, -1, 3] as [number, number, number], scale: 1, color: "#EC4899" },
    { position: [6, -0.5, 2] as [number, number, number], scale: 1.2, color: "#06B6D4" },
    { position: [-4, 1, -4] as [number, number, number], scale: 0.8, color: "#F59E0B" },
    { position: [5, 0.5, -5] as [number, number, number], scale: 1.1, color: "#10B981" },
    { position: [1, -2, 6] as [number, number, number], scale: 0.9, color: "#8B5CF6" },
    { position: [-7, 0, -2] as [number, number, number], scale: 0.7, color: "#EC4899" },
    { position: [8, -1, 3] as [number, number, number], scale: 1.3, color: "#06B6D4" },
    
    // New mushrooms - expanding the field
    { position: [-8, 2, 1] as [number, number, number], scale: 1.4, color: "#A855F7" },
    { position: [3, 1.5, -7] as [number, number, number], scale: 0.6, color: "#F97316" },
    { position: [-2, -1.5, 8] as [number, number, number], scale: 1.1, color: "#EF4444" },
    { position: [9, 0.8, -1] as [number, number, number], scale: 0.9, color: "#06B6D4" },
    { position: [-6, -2, -6] as [number, number, number], scale: 1.2, color: "#84CC16" },
    { position: [2, 2, 9] as [number, number, number], scale: 0.8, color: "#8B5CF6" },
    { position: [-10, 1, 4] as [number, number, number], scale: 1.0, color: "#EC4899" },
    { position: [7, -2.5, -3] as [number, number, number], scale: 1.3, color: "#F59E0B" },
    
    // Far field mushrooms - creating depth
    { position: [-12, 0, -8] as [number, number, number], scale: 0.5, color: "#A855F7" },
    { position: [11, 1, 7] as [number, number, number], scale: 0.7, color: "#10B981" },
    { position: [-5, 3, -10] as [number, number, number], scale: 0.9, color: "#06B6D4" },
    { position: [13, -1, 2] as [number, number, number], scale: 0.6, color: "#EC4899" },
    { position: [-9, -3, 9] as [number, number, number], scale: 1.1, color: "#F97316" },
    { position: [4, 2.5, -12] as [number, number, number], scale: 0.8, color: "#8B5CF6" },
    
    // Scattered individual mushrooms
    { position: [-15, 1.5, 0] as [number, number, number], scale: 0.4, color: "#A855F7" },
    { position: [0, -3, -15] as [number, number, number], scale: 0.6, color: "#EF4444" },
    { position: [15, 0.5, 5] as [number, number, number], scale: 0.5, color: "#84CC16" },
    { position: [-7, 4, 12] as [number, number, number], scale: 0.7, color: "#F59E0B" },
    { position: [12, -2, -9] as [number, number, number], scale: 0.9, color: "#06B6D4" },
    { position: [-13, -1, -5] as [number, number, number], scale: 0.8, color: "#EC4899" },
    
    // Additional variety mushrooms
    { position: [6, 3, 11] as [number, number, number], scale: 1.0, color: "#10B981" },
    { position: [-11, 2, -12] as [number, number, number], scale: 0.6, color: "#8B5CF6" },
    { position: [14, 1, -6] as [number, number, number], scale: 0.7, color: "#F97316" },
    { position: [-3, -4, 14] as [number, number, number], scale: 0.9, color: "#A855F7" },
    { position: [8, 4, -11] as [number, number, number], scale: 0.5, color: "#EF4444" },
    { position: [-16, 0, 7] as [number, number, number], scale: 0.8, color: "#84CC16" },
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
