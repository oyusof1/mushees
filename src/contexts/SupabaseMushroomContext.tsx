import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { MushroomVariety, MushroomContextType } from '@/types/mushroom';
import { toast } from '@/components/ui/use-toast';

type DatabaseMushroom = Database['public']['Tables']['mushroom_varieties']['Row'];

// Convert database format to app format
const dbToAppFormat = (dbMushroom: DatabaseMushroom): MushroomVariety => ({
  id: dbMushroom.id,
  name: dbMushroom.name,
  scientific: dbMushroom.scientific,
  description: dbMushroom.description,
  effects: dbMushroom.effects,
  potency: dbMushroom.potency,
  duration: dbMushroom.duration,
  color: dbMushroom.color,
  image: dbMushroom.image,
  tier: dbMushroom.tier,
  pricing: dbMushroom.pricing,
  category: dbMushroom.category,
  isActive: dbMushroom.is_active,
  createdAt: dbMushroom.created_at,
  updatedAt: dbMushroom.updated_at,
});

// Convert app format to database format
const appToDbFormat = (appMushroom: Omit<MushroomVariety, 'id' | 'createdAt' | 'updatedAt'>): Database['public']['Tables']['mushroom_varieties']['Insert'] => ({
  name: appMushroom.name,
  scientific: appMushroom.scientific,
  description: appMushroom.description,
  effects: appMushroom.effects,
  potency: appMushroom.potency,
  duration: appMushroom.duration,
  color: appMushroom.color,
  image: appMushroom.image,
  tier: appMushroom.tier,
  pricing: appMushroom.pricing,
  category: appMushroom.category,
  is_active: appMushroom.isActive,
});

type MushroomAction =
  | { type: 'SET_MUSHROOMS'; payload: MushroomVariety[] }
  | { type: 'ADD_MUSHROOM'; payload: MushroomVariety }
  | { type: 'UPDATE_MUSHROOM'; payload: MushroomVariety }
  | { type: 'DELETE_MUSHROOM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface MushroomState {
  mushrooms: MushroomVariety[];
  loading: boolean;
  error: string | null;
}

function mushroomReducer(state: MushroomState, action: MushroomAction): MushroomState {
  switch (action.type) {
    case 'SET_MUSHROOMS':
      return { ...state, mushrooms: action.payload, loading: false };
    case 'ADD_MUSHROOM':
      return { ...state, mushrooms: [...state.mushrooms, action.payload] };
    case 'UPDATE_MUSHROOM':
      return {
        ...state,
        mushrooms: state.mushrooms.map(mushroom =>
          mushroom.id === action.payload.id ? action.payload : mushroom
        )
      };
    case 'DELETE_MUSHROOM':
      return {
        ...state,
        mushrooms: state.mushrooms.filter(mushroom => mushroom.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface ExtendedMushroomContextType extends MushroomContextType {
  loading: boolean;
  error: string | null;
}

const MushroomContext = createContext<ExtendedMushroomContextType | undefined>(undefined);

export const SupabaseMushroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mushroomReducer, {
    mushrooms: [],
    loading: true,
    error: null
  });

  // Load mushrooms from Supabase on mount
  useEffect(() => {
    loadMushrooms();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('mushroom_varieties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mushroom_varieties'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                const newMushroom = dbToAppFormat(payload.new as DatabaseMushroom);
                dispatch({ 
                  type: 'ADD_MUSHROOM', 
                  payload: newMushroom
                });
                console.log('Added mushroom via real-time:', newMushroom.name);
              }
              break;
            case 'UPDATE':
              if (payload.new) {
                const updatedMushroom = dbToAppFormat(payload.new as DatabaseMushroom);
                dispatch({ 
                  type: 'UPDATE_MUSHROOM', 
                  payload: updatedMushroom
                });
                console.log('Updated mushroom via real-time:', updatedMushroom.name);
              }
              break;
            case 'DELETE':
              if (payload.old) {
                const deletedId = (payload.old as DatabaseMushroom).id;
                dispatch({ 
                  type: 'DELETE_MUSHROOM', 
                  payload: deletedId
                });
                console.log('Deleted mushroom via real-time:', deletedId);
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    console.log('Real-time subscription initialized');

    return () => {
      console.log('Unsubscribing from real-time updates');
      subscription.unsubscribe();
    };
  }, []);

  const loadMushrooms = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await supabase
        .from('mushroom_varieties')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mushrooms = data.map(dbToAppFormat);
      dispatch({ type: 'SET_MUSHROOMS', payload: mushrooms });
    } catch (error) {
      console.error('Error loading mushrooms:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load mushrooms' });
    }
  };

  const addMushroom = async (mushroom: Omit<MushroomVariety, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await supabase
        .from('mushroom_varieties')
        .insert([appToDbFormat(mushroom)])
        .select()
        .single();

      if (error) throw error;

      // Optimistically update UI with the new mushroom
      if (data) {
        const newMushroom = dbToAppFormat(data);
        dispatch({ type: 'ADD_MUSHROOM', payload: newMushroom });
      }

      toast({
        title: "Success!",
        description: `${mushroom.name} has been added successfully.`,
        variant: "default",
      });

      // Real-time subscription will also handle the UI update for other clients
      console.log('Mushroom added successfully');
    } catch (error) {
      console.error('Error adding mushroom:', error);
      toast({
        title: "Error",
        description: "Failed to add mushroom. Please try again.",
        variant: "destructive",
      });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add mushroom' });
    }
  };

  const updateMushroom = async (id: string, updates: Partial<MushroomVariety>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Find the current mushroom to get the full object
      const currentMushroom = state.mushrooms.find(m => m.id === id);
      if (!currentMushroom) {
        throw new Error('Mushroom not found');
      }

      // Convert updates to database format
      const dbUpdates: Database['public']['Tables']['mushroom_varieties']['Update'] = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.scientific !== undefined) dbUpdates.scientific = updates.scientific;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.effects !== undefined) dbUpdates.effects = updates.effects;
      if (updates.potency !== undefined) dbUpdates.potency = updates.potency;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.tier !== undefined) dbUpdates.tier = updates.tier;
      if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      
      const updatedAt = new Date().toISOString();
      dbUpdates.updated_at = updatedAt;

      const { error } = await supabase
        .from('mushroom_varieties')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Immediately update local state for instant UI feedback
      const updatedMushroom = {
        ...currentMushroom,
        ...updates,
        updatedAt
      };
      dispatch({ type: 'UPDATE_MUSHROOM', payload: updatedMushroom });

      toast({
        title: "Success!",
        description: "Mushroom has been updated successfully.",
        variant: "default",
      });

      console.log('Mushroom updated successfully');
    } catch (error) {
      console.error('Error updating mushroom:', error);
      toast({
        title: "Error",
        description: "Failed to update mushroom. Please try again.",
        variant: "destructive",
      });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update mushroom' });
    }
  };

  const deleteMushroom = async (id: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      const { error } = await supabase
        .from('mushroom_varieties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Immediately update local state for instant UI feedback
      dispatch({ type: 'DELETE_MUSHROOM', payload: id });

      toast({
        title: "Success!",
        description: "Mushroom has been deleted successfully.",
        variant: "default",
      });

      console.log('Mushroom deleted successfully');
    } catch (error) {
      console.error('Error deleting mushroom:', error);
      toast({
        title: "Error",
        description: "Failed to delete mushroom. Please try again.",
        variant: "destructive",
      });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete mushroom' });
    }
  };

  const toggleMushroomActive = async (id: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Find the current mushroom to toggle its active state
      const currentMushroom = state.mushrooms.find(m => m.id === id);
      if (!currentMushroom) {
        throw new Error('Mushroom not found');
      }

      const newActiveState = !currentMushroom.isActive;
      const updatedAt = new Date().toISOString();

      // Direct database update to avoid any race conditions
      const { error } = await supabase
        .from('mushroom_varieties')
        .update({ 
          is_active: newActiveState,
          updated_at: updatedAt
        })
        .eq('id', id);

      if (error) throw error;

      // Immediately update local state for instant UI feedback
      const updatedMushroom = {
        ...currentMushroom,
        isActive: newActiveState,
        updatedAt
      };
      dispatch({ type: 'UPDATE_MUSHROOM', payload: updatedMushroom });

      toast({
        title: "Success!",
        description: `${currentMushroom.name} has been ${newActiveState ? 'activated' : 'deactivated'}.`,
        variant: "default",
      });

      console.log(`Mushroom ${currentMushroom.name} ${newActiveState ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling mushroom active state:', error);
      toast({
        title: "Error",
        description: "Failed to toggle mushroom visibility. Please try again.",
        variant: "destructive",
      });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle mushroom visibility' });
    }
  };

  return (
    <MushroomContext.Provider value={{
      mushrooms: state.mushrooms,
      loading: state.loading,
      error: state.error,
      addMushroom,
      updateMushroom,
      deleteMushroom,
      toggleMushroomActive
    }}>
      {children}
    </MushroomContext.Provider>
  );
};

export const useSupabaseMushrooms = () => {
  const context = useContext(MushroomContext);
  if (context === undefined) {
    throw new Error('useSupabaseMushrooms must be used within a SupabaseMushroomProvider');
  }
  return context;
}; 