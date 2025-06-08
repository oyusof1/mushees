
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mushroomVarieties = [
  {
    name: "Golden Teachers",
    scientific: "Psilocybe cubensis",
    description: "Perfect for beginners seeking wisdom and introspection",
    effects: ["Euphoria", "Visual Enhancement", "Deep Insights"],
    potency: "Moderate",
    duration: "4-6 hours",
    color: "from-yellow-400 to-orange-500"
  },
  {
    name: "Blue Meanies",
    scientific: "Panaeolus cyanescens",
    description: "Intense visuals and profound consciousness expansion",
    effects: ["Strong Visuals", "Ego Dissolution", "Time Distortion"],
    potency: "High",
    duration: "6-8 hours",
    color: "from-blue-400 to-cyan-500"
  },
  {
    name: "Penis Envy",
    scientific: "Psilocybe cubensis var.",
    description: "One of the most potent varieties for experienced journeyers",
    effects: ["Intense Body High", "Reality Shifts", "Spiritual Awakening"],
    potency: "Very High",
    duration: "5-7 hours",
    color: "from-purple-400 to-pink-500"
  },
  {
    name: "Liberty Caps",
    scientific: "Psilocybe semilanceata",
    description: "Classic European variety with gentle, flowing experiences",
    effects: ["Gentle Euphoria", "Nature Connection", "Creative Flow"],
    potency: "Moderate",
    duration: "4-5 hours",
    color: "from-green-400 to-emerald-500"
  },
  {
    name: "Albino A+",
    scientific: "Psilocybe cubensis albino",
    description: "Rare albino variety with clean, clear-headed journeys",
    effects: ["Mental Clarity", "Emotional Release", "Peaceful Insights"],
    potency: "Moderate-High",
    duration: "5-6 hours",
    color: "from-white to-gray-300"
  },
  {
    name: "McKennaii",
    scientific: "Psilocybe cubensis",
    description: "Named after Terence McKenna, for philosophical exploration",
    effects: ["Deep Thoughts", "Pattern Recognition", "Cosmic Awareness"],
    potency: "High",
    duration: "6-7 hours",
    color: "from-indigo-400 to-purple-600"
  }
];

const getPotencyColor = (potency: string) => {
  switch (potency) {
    case "Moderate": return "bg-green-500";
    case "Moderate-High": return "bg-yellow-500";
    case "High": return "bg-orange-500";
    case "Very High": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export const MushroomMenu = () => {
  return (
    <section className="py-20 px-4 min-h-screen bg-gradient-to-b from-purple-900/20 to-black/40">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 psychedelic-text">
            Sacred Menu
          </h2>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Carefully curated varieties for your consciousness exploration journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mushroomVarieties.map((mushroom, index) => (
            <Card 
              key={index} 
              className={`mushroom-card hover:scale-105 transition-all duration-1000 animate-float glow-effect border-2 border-purple-500/30 hover:border-purple-400/60`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${mushroom.color} animate-pulse-glow`}></div>
                <CardTitle className="text-2xl font-bold text-purple-100">
                  {mushroom.name}
                </CardTitle>
                <CardDescription className="text-purple-300 italic">
                  {mushroom.scientific}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-center">
                  {mushroom.description}
                </p>
                
                <div className="flex justify-center">
                  <Badge className={`${getPotencyColor(mushroom.potency)} text-white font-semibold`}>
                    {mushroom.potency} Potency
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-purple-300 font-semibold">Duration: {mushroom.duration}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-purple-100 font-semibold text-center">Effects:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mushroom.effects.map((effect, i) => (
                      <Badge key={i} variant="outline" className="text-cyan-300 border-cyan-300/50">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-block p-6 rounded-2xl bg-purple-900/30 border border-purple-500/30 glow-effect">
            <h3 className="text-2xl font-bold text-purple-100 mb-2">Journey Responsibly</h3>
            <p className="text-purple-300">
              Set, setting, and intention are key to a meaningful experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
