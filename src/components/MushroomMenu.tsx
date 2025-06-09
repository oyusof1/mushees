import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mushroomVarieties = [
  {
    name: "Thrasher Penis Envy",
    scientific: "Psilocybe cubensis var.",
    description: "An even more potent variant of the classic Penis Envy strain",
    effects: ["Intense Visuals", "Deep Introspection", "Ego Dissolution"],
    potency: "Very High",
    duration: "6-8 hours",
    color: "from-purple-600 to-pink-600",
    image: "/thrasher penis envy.jpeg",
    tier: "MegaBooms",
    pricing: {
      "1/8": "$35",
      "1/4": "$50",
      "1/2": "$85", 
      "Oz": "$160"
    }
  },
  {
    name: "Penis Envy",
    scientific: "Psilocybe cubensis var.",
    description: "One of the most potent varieties for experienced journeyers",
    effects: ["Intense Body High", "Reality Shifts", "Spiritual Awakening"],
    potency: "Very High",
    duration: "5-7 hours",
    color: "from-purple-400 to-pink-500",
    image: "/penis envy.jpeg",
    tier: "Boomers",
    pricing: {
      "1/8": "$30",
      "1/4": "$45", 
      "1/2": "$75",
      "Oz": "$140"
    }
  },
 
  {
    name: "Albino Roller Coaster",
    scientific: "Psilocybe cubensis albino",
    description: "Rare albino variety with intense, wave-like experiences",
    effects: ["Mental Clarity", "Emotional Waves", "Visual Distortions"],
    potency: "High",
    duration: "5-7 hours",
    color: "from-white to-gray-300",
    image: "/albino roller coaster.jpeg",
    tier: "Medium Tier",
    pricing: {
      "1/8": "$25",
      "1/4": "$40",
      "1/2": "$70",
      "Oz": "$130"
    }
  },
  {
    name: "Hillbilly Pumpkins",
    scientific: "Psilocybe cubensis",
    description: "Unique orange-capped variety with earthy, grounding effects",
    effects: ["Nature Connection", "Grounding Energy", "Creative Flow"],
    potency: "Moderate-High",
    duration: "4-6 hours",
    color: "from-orange-400 to-yellow-500",
    image: "/hillbbilly pumpkins.jpeg",
    tier: "Light Tier",
    pricing: {
      "1/8": "$20",
      "1/4": "$35",
      "1/2": "$60",
      "Oz": "$110"
    }
  },
  {
    name: "Golden Teachers",
    scientific: "Psilocybe cubensis",
    description: "Perfect for beginners seeking wisdom and introspection",
    effects: ["Euphoria", "Visual Enhancement", "Deep Insights"],
    potency: "Moderate",
    duration: "4-6 hours",
    color: "from-yellow-400 to-orange-500",
    image: null,
    redacted: {
      name: "████ ███████",
      scientific: "████████ ████████",
      description: "████████ ███ ██████████ ████████ ██████ ███ ████████████",
      effects: ["████████", "██████ ███████████", "████ ████████"],
      potency: "████████",
      duration: "█-█ █████"
    }
  },
  {
    name: "Blue Meanies",
    scientific: "Panaeolus cyanescens",
    description: "Intense visuals and profound consciousness expansion",
    effects: ["Strong Visuals", "Ego Dissolution", "Time Distortion"],
    potency: "High",
    duration: "6-8 hours",
    color: "from-blue-400 to-cyan-500",
    image: null,
    redacted: {
      name: "████ ███████",
      scientific: "█████████ ██████████",
      description: "███████ ███████ ███ ████████ ████████████ █████████",
      effects: ["██████ ███████", "███ ███████████", "████ ██████████"],
      potency: "████",
      duration: "█-█ █████"
    }
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

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Light Tier": return "bg-green-500";
    case "Medium Tier": return "bg-yellow-500";
    case "Boomers": return "bg-orange-500";
    case "MegaBooms": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export const MushroomMenu = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="menu" className="py-20 px-4 min-h-screen relative overflow-hidden">
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/40 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent"></div>
      
      {/* Subtle animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Menu
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Carefully curated varieties for your consciousness exploration journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mushroomVarieties.map((mushroom, index) => (
            <Card 
              key={index} 
              className={`mushroom-card hover:scale-105 transition-all duration-1000 animate-float glow-effect border-2 ${!mushroom.image ? 'border-yellow-500/40 hover:border-yellow-400/60' : 'border-purple-500/30 hover:border-purple-400/60'} ${!mushroom.image ? 'opacity-95' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                {mushroom.image ? (
                  <div 
                    className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedImage(mushroom.image)}
                  >
                    <img 
                      src={mushroom.image} 
                      alt={mushroom.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center border-2 border-dashed border-yellow-500/50 relative">
                    <span className="text-xs text-yellow-400 text-center px-2 font-semibold">COMING<br/>SOON</span>
                    <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse"></div>
                  </div>
                )}
                <CardTitle className="text-2xl font-bold text-purple-100">
                  {!mushroom.image ? (
                    <div>
                      <span className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/30">
                        {mushroom.redacted?.name}
                      </span>
                      <span className="text-sm text-yellow-400 block mt-2 font-semibold">
                       NEW STRAIN COMING SOON 🔥
                      </span>
                    </div>
                  ) : (
                    mushroom.name
                  )}
                </CardTitle>
                <CardDescription className="text-purple-300 italic">
                  {!mushroom.image ? (
                    <span className="text-yellow-400/70 bg-yellow-900/10 px-2 py-1 rounded text-sm">
                      {mushroom.redacted?.scientific}
                    </span>
                  ) : (
                    mushroom.scientific
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-center">
                  {!mushroom.image ? (
                    <span className="text-yellow-400/80 bg-yellow-900/10 px-2 py-1 rounded text-sm leading-relaxed block">
                      {mushroom.redacted?.description}
                    </span>
                  ) : (
                    mushroom.description
                  )}
                </p>
                
                <div className="flex justify-center gap-2">
                  <Badge className={`${!mushroom.image ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border border-yellow-500/50' : getPotencyColor(mushroom.potency)} text-white font-semibold`}>
                    {!mushroom.image ? mushroom.redacted?.potency : mushroom.potency} Potency
                  </Badge>
                  {mushroom.tier && (
                    <Badge className={`${getTierColor(mushroom.tier)} text-white font-semibold`}>
                      {mushroom.tier}
                    </Badge>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-purple-300 font-semibold">
                    Duration: {!mushroom.image ? (
                      <span className="text-yellow-400/80 bg-yellow-900/10 px-1 rounded">
                        {mushroom.redacted?.duration}
                      </span>
                    ) : (
                      mushroom.duration
                    )}
                  </p>
                </div>

                {mushroom.pricing && (
                  <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                    <h5 className="text-purple-100 font-semibold text-center mb-2">Pricing</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(mushroom.pricing).map(([quantity, price]) => (
                        <div key={quantity} className="flex justify-between text-purple-200">
                          <span>{quantity}:</span>
                          <span className="font-semibold text-green-400">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-purple-100 font-semibold text-center">Effects:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(!mushroom.image ? mushroom.redacted?.effects : mushroom.effects)?.map((effect, i) => (
                      <Badge key={i} variant="outline" className={`${!mushroom.image ? 'text-yellow-400 border-yellow-500/50 bg-yellow-900/10 text-xs' : 'text-cyan-300 border-cyan-300/50'}`}>
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Products */}
        <div id="specialty-products" className="mt-16 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Specialty Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Trippy Treats */}
            <Card className="mushroom-card glow-effect border-2 border-pink-500/30 hover:border-pink-400/60 transition-all duration-500">
              <CardHeader className="text-center">
                <div 
                  className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSelectedImage("/trippy treats.jpeg")}
                >
                  <img 
                    src="/trippy treats.jpeg" 
                    alt="Trippy Treats"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-100">Trippy Treats</CardTitle>
                <CardDescription className="text-purple-300 italic">Delicious edible experiences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-center">Premium edibles for a controlled, enjoyable journey</p>
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                  <h5 className="text-purple-100 font-semibold text-center mb-2">Pricing</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-purple-200">
                      <span>1 Treat:</span>
                      <span className="font-semibold text-green-400">$40</span>
                    </div>
                    <div className="flex justify-between text-purple-200">
                      <span>3 Treats:</span>
                      <span className="font-semibold text-green-400">$100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Super Juice */}
            <Card className="mushroom-card glow-effect border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500">
              <CardHeader className="text-center">
                <div 
                  className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSelectedImage("/super juice.jpeg")}
                >
                  <img 
                    src="/super juice.jpeg" 
                    alt="Super Juice"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-100">Super Juice</CardTitle>
                <CardDescription className="text-purple-300 italic">Concentrated liquid experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-center">Potent liquid form for precise dosing and fast onset</p>
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                  <h5 className="text-purple-100 font-semibold text-center mb-2">Pricing</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-purple-200">
                      <span>1 Bottle:</span>
                      <span className="font-semibold text-green-400">$30</span>
                    </div>
                    <div className="flex justify-between text-purple-200">
                      <span>3 Bottles:</span>
                      <span className="font-semibold text-green-400">$60</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Enlarged mushroom strain"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
