
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei';
import { MushroomGroup } from './MushroomGroup';
import { ParticleField } from './ParticleField';

export const PsychedelicScene = () => {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        className="w-full h-full"
      >
        <Environment preset="night" />
        
        {/* Ambient lighting for mystical atmosphere */}
        <ambientLight intensity={0.3} color="#8B5CF6" />
        
        {/* Main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color="#EC4899"
          castShadow
        />
        
        {/* Secondary colored lights */}
        <pointLight position={[-5, 3, -5]} intensity={0.8} color="#06B6D4" />
        <pointLight position={[5, -3, 5]} intensity={0.6} color="#F59E0B" />
        
        {/* Sparkles for magical effect */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sparkles
            count={100}
            scale={[20, 20, 20]}
            size={3}
            speed={0.6}
            color="#8B5CF6"
          />
        </Float>
        
        {/* Mushroom groups */}
        <MushroomGroup />
        
        {/* Particle field */}
        <ParticleField />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
      
      {/* Overlay content */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="text-center pointer-events-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 psychedelic-text animate-pulse-glow">
            MUSHEES
          </h1>
          <p className="text-xl md:text-2xl text-purple-300 animate-float">
            Journey into the mystical realm
          </p>
        </div>
      </div>
    </div>
  );
};
