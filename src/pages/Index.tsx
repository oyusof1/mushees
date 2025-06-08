
import { PsychedelicScene } from "@/components/PsychedelicScene";
import { MushroomMenu } from "@/components/MushroomMenu";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Scene */}
      <PsychedelicScene />
      
      {/* Menu Section */}
      <MushroomMenu />
      
      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-sm py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-purple-300 text-lg">
            🍄 Embrace the journey, respect the medicine 🍄
          </p>
          <p className="text-purple-400 mt-2 text-sm">
            For educational and harm reduction purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
