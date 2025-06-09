import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei';
import { MushroomGroup } from './MushroomGroup';
import { ParticleField } from './ParticleField';
import { useState } from 'react';
import { siFacebook, siInstagram } from 'simple-icons';

export const PsychedelicScene = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="w-full h-screen relative" id="home">
      {/* Hamburger Menu */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 flex flex-col justify-center items-center space-y-1 hover:bg-black/70 transition-all"
        >
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 p-4 min-w-48">
            <nav className="space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left text-white hover:text-cyan-400 transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => scrollToSection('menu')}
                className="block w-full text-left text-white hover:text-cyan-400 transition-colors"
              >
                🍄 Menu
              </button>
              <button
                onClick={() => scrollToSection('specialty-products')}
                className="block w-full text-left text-white hover:text-cyan-400 transition-colors"
              >
                ✨ Specialty Products
              </button>
              <button
                onClick={() => scrollToSection('location')}
                className="block w-full text-left text-white hover:text-cyan-400 transition-colors"
              >
                📍 Location
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="absolute top-6 right-6 z-20 flex space-x-3">
        <a
          href="https://www.facebook.com/profile.php?id=61575899121353&mibextid=wwXIfr&rdid=f1spfnAE4mQs1Xn7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F168iESgm5T%2F%3Fmibextid%3DwwXIfr#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d={siFacebook.path} />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/mush.ees?igsh=MXF3dHhoMTBhM2trbQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d={siInstagram.path} />
          </svg>
        </a>
      </div>

      <Canvas
        camera={{ position: [5, 3, 8], fov: 60 }}
        className="w-full h-full"
      >
        <Environment preset="night" />
        
        {/* Ambient lighting for mystical atmosphere */}
        <ambientLight intensity={0.3} color="#8B5CF6" />
        
        {/* Main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#EC4899"
          castShadow
        />
        
        {/* Secondary colored lights */}
        <pointLight position={[-5, 3, -5]} intensity={0.8} color="#06B6D4" />
        <pointLight position={[5, -3, 5]} intensity={0.6} color="#F59E0B" />
        
        {/* Sparkles for magical effect */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sparkles
            count={150}
            scale={[25, 25, 25]}
            size={4}
            speed={0.4}
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
          autoRotateSpeed={0.3}
          minDistance={5}
          maxDistance={25}
        />
      </Canvas>
      
      {/* Overlay content */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="text-center pointer-events-auto">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-4"
            style={{ 
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)'
            }}
          >
            MUSHEES
          </h1>
          <p 
            className="text-xl md:text-2xl"
            style={{ 
              color: '#FFFFFF',
              opacity: 0.8
            }}
          >
            Journey into the mystical realm
          </p>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={() => scrollToSection('menu')}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all animate-bounce"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
