export interface MushroomVariety {
  id: string;
  name: string;
  scientific: string;
  description: string;
  effects: string[];
  potency: "Moderate" | "Moderate-High" | "High" | "Very High";
  duration: string;
  color: string;
  image: string | null;
  tier: "Light Tier" | "Medium Tier" | "Boomers" | "MegaBooms";
  pricing: {
    [key: string]: string; // More flexible pricing for specialty products
  };
  category: "mushroom" | "specialty";
  redacted?: {
    name: string;
    scientific: string;
    description: string;
    effects: string[];
    potency: string;
    duration: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MushroomContextType {
  mushrooms: MushroomVariety[];
  addMushroom: (mushroom: Omit<MushroomVariety, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMushroom: (id: string, mushroom: Partial<MushroomVariety>) => void;
  deleteMushroom: (id: string) => void;
  toggleMushroomActive: (id: string) => void;
} 