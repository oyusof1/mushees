import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useMemo } from "react";
import { useSupabaseMushrooms } from "@/contexts/SupabaseMushroomContext";

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

// Lazy loading image component
const LazyImage = ({ src, alt, className, onClick }: { 
  src: string; 
  alt: string; 
  className?: string; 
  onClick?: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
};

export const MushroomMenu = () => {
  const { mushrooms, loading } = useSupabaseMushrooms();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Filter only active mushrooms for the public menu
  const activeMushrooms = useMemo(() => 
    mushrooms.filter(mushroom => mushroom.isActive), 
    [mushrooms]
  );

  // Separate mushrooms and specialty products
  const mushroomVarieties = useMemo(() => 
    activeMushrooms.filter(m => m.category === 'mushroom'), 
    [activeMushrooms]
  );
  
  const specialtyProducts = useMemo(() => 
    activeMushrooms.filter(m => m.category === 'specialty'), 
    [activeMushrooms]
  );

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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-300">Loading mushroom varieties...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mushroom Varieties Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mushroomVarieties.map((mushroom, index) => (
            <Card 
              key={mushroom.id} 
              className={`mushroom-card hover:scale-105 transition-all duration-1000 animate-float glow-effect border-2 ${!mushroom.image ? 'border-yellow-500/40 hover:border-yellow-400/60' : 'border-purple-500/30 hover:border-purple-400/60'} ${!mushroom.image ? 'opacity-95' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                {mushroom.image ? (
                  <div 
                    className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedImage(mushroom.image)}
                  >
                    <LazyImage 
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
            
            {/* Specialty Products Section */}
            {specialtyProducts.length > 0 && (
              <div className="mt-16">
                <div className="text-center mb-12">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Specialty Products
                  </h3>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Premium edibles and concentrates for a unique journey
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {specialtyProducts.map((product, index) => (
                    <Card 
                      key={product.id} 
                      className={`mushroom-card hover:scale-105 transition-all duration-1000 animate-float glow-effect border-2 border-pink-500/30 hover:border-pink-400/60`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <CardHeader className="text-center">
                        {product.image ? (
                          <div 
                            className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => setSelectedImage(product.image)}
                          >
                            <LazyImage 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center border-2 border-dashed border-pink-500/50">
                            <span className="text-xs text-pink-400 text-center px-2">COMING<br/>SOON</span>
                          </div>
                        )}
                        <CardTitle className="text-2xl font-bold text-purple-100">{product.name}</CardTitle>
                        <CardDescription className="text-purple-300 italic">{product.scientific}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-purple-200 text-center">{product.description}</p>
                        
                        <div className="flex justify-center gap-2">
                          <Badge className={`${getPotencyColor(product.potency)} text-white font-semibold`}>
                            {product.potency} Potency
                          </Badge>
                          <Badge className={`${getTierColor(product.tier)} text-white font-semibold`}>
                            {product.tier}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-purple-300 font-semibold">
                            Duration: {product.duration}
                          </p>
                        </div>

                        {product.pricing && (
                          <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                            <h5 className="text-purple-100 font-semibold text-center mb-2">Pricing</h5>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              {Object.entries(product.pricing).map(([quantity, price]) => (
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
                            {product.effects?.map((effect, i) => (
                              <Badge key={i} variant="outline" className="text-pink-300 border-pink-300/50">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

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
