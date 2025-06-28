import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { useSupabaseMushrooms } from '@/contexts/SupabaseMushroomContext';
import { MushroomVariety } from '@/types/mushroom';
import { ImageUpload } from '@/components/ui/image-upload';

const mushroomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  scientific: z.string().min(1, 'Scientific name is required'),
  description: z.string().min(1, 'Description is required'),
  effects: z.array(z.string()).min(1, 'At least one effect is required'),
  potency: z.enum(['Moderate', 'Moderate-High', 'High', 'Very High']),
  duration: z.string().min(1, 'Duration is required'),
  color: z.string().min(1, 'Color gradient is required'),
  image: z.string().nullable(),
  tier: z.enum(['Light Tier', 'Medium Tier', 'Boomers', 'MegaBooms']),
  pricing: z.record(z.string().min(1, 'Price required')),
  category: z.enum(['mushroom', 'specialty']),
  isActive: z.boolean(),
});

type MushroomFormData = z.infer<typeof mushroomSchema>;

interface MushroomFormProps {
  mushroom?: MushroomVariety | null;
  onClose: () => void;
}

export const MushroomForm = ({ mushroom, onClose }: MushroomFormProps) => {
  const { addMushroom, updateMushroom, loading } = useSupabaseMushrooms();
  const [currentEffect, setCurrentEffect] = useState('');
  const [effects, setEffects] = useState<string[]>([]);
  const [pricingEntries, setPricingEntries] = useState<Array<{key: string, value: string}>>([
    { key: '1/8', value: '$' },
    { key: '1/4', value: '$' },
    { key: '1/2', value: '$' },
    { key: 'Oz', value: '$' },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<MushroomFormData>({
    resolver: zodResolver(mushroomSchema),
    defaultValues: {
      name: '',
      scientific: '',
      description: '',
      effects: [],
      potency: 'Moderate',
      duration: '',
      color: 'from-purple-400 to-pink-500',
      image: '',
      tier: 'Light Tier',
      pricing: {
        '1/8': '$',
        '1/4': '$',
        '1/2': '$',
        'Oz': '$',
      },
      category: 'mushroom',
      isActive: true,
    }
  });

  // Initialize form with existing mushroom data
  useEffect(() => {
    if (mushroom) {
      reset({
        name: mushroom.name,
        scientific: mushroom.scientific,
        description: mushroom.description,
        effects: mushroom.effects,
        potency: mushroom.potency,
        duration: mushroom.duration,
        color: mushroom.color,
        image: mushroom.image || '',
        tier: mushroom.tier,
        pricing: mushroom.pricing,
        category: mushroom.category,
        isActive: mushroom.isActive,
      });
      setEffects(mushroom.effects);
      
      // Convert pricing object to entries for editing
      const entries = Object.entries(mushroom.pricing).map(([key, value]) => ({ key, value }));
      setPricingEntries(entries);
    } else {
      // Set default pricing based on category
      const category = watch('category');
      if (category === 'specialty') {
        setPricingEntries([
          { key: '1 Item', value: '$' },
          { key: '3 Items', value: '$' },
          { key: '5 Items', value: '$' },
        ]);
      } else {
        setPricingEntries([
          { key: '1/8', value: '$' },
          { key: '1/4', value: '$' },
          { key: '1/2', value: '$' },
          { key: 'Oz', value: '$' },
        ]);
      }
    }
  }, [mushroom, reset, watch]);

  const addEffect = () => {
    if (currentEffect.trim() && !effects.includes(currentEffect.trim())) {
      const newEffects = [...effects, currentEffect.trim()];
      setEffects(newEffects);
      setValue('effects', newEffects);
      setCurrentEffect('');
    }
  };

  const removeEffect = (effectToRemove: string) => {
    const newEffects = effects.filter(effect => effect !== effectToRemove);
    setEffects(newEffects);
    setValue('effects', newEffects);
  };

  const addPricingEntry = () => {
    setPricingEntries([...pricingEntries, { key: '', value: '$' }]);
  };

  const removePricingEntry = (index: number) => {
    const newEntries = pricingEntries.filter((_, i) => i !== index);
    setPricingEntries(newEntries);
    updatePricingValue();
  };

  const updatePricingEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...pricingEntries];
    newEntries[index][field] = value;
    setPricingEntries(newEntries);
    updatePricingValue();
  };

  const updatePricingValue = () => {
    const pricingObject = pricingEntries.reduce((acc, entry) => {
      if (entry.key.trim()) {
        acc[entry.key.trim()] = entry.value;
      }
      return acc;
    }, {} as Record<string, string>);
    setValue('pricing', pricingObject);
  };

  // Update pricing when entries change
  useEffect(() => {
    updatePricingValue();
  }, [pricingEntries]);

  const onSubmit = (data: MushroomFormData) => {
    const mushroomData = {
      name: data.name!,
      scientific: data.scientific!,
      description: data.description!,
      effects: effects,
      potency: data.potency!,
      duration: data.duration!,
      color: data.color!,
      image: data.image || null,
      tier: data.tier!,
      pricing: data.pricing!,
      category: data.category!,
      isActive: data.isActive!,
    };

    if (mushroom) {
      updateMushroom(mushroom.id, mushroomData);
    } else {
      addMushroom(mushroomData);
    }
    onClose();
  };

  const colorOptions = [
    { value: 'from-purple-600 to-pink-600', label: 'Purple to Pink' },
    { value: 'from-purple-400 to-pink-500', label: 'Light Purple to Pink' },
    { value: 'from-white to-gray-300', label: 'White to Gray' },
    { value: 'from-orange-400 to-yellow-500', label: 'Orange to Yellow' },
    { value: 'from-yellow-400 to-orange-500', label: 'Yellow to Orange' },
    { value: 'from-blue-400 to-cyan-500', label: 'Blue to Cyan' },
    { value: 'from-green-400 to-blue-500', label: 'Green to Blue' },
    { value: 'from-red-400 to-pink-500', label: 'Red to Pink' },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-purple-900/95 border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mushroom ? 'Edit Mushroom' : 'Add New Mushroom'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                {...register('name')}
                className="bg-purple-800/50 border-purple-500/50 text-white"
                placeholder="e.g., Golden Teachers"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="scientific" className="text-white">Scientific Name</Label>
              <Input
                {...register('scientific')}
                className="bg-purple-800/50 border-purple-500/50 text-white"
                placeholder="e.g., Psilocybe cubensis"
              />
              {errors.scientific && <p className="text-red-400 text-sm">{errors.scientific.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              {...register('description')}
              className="bg-purple-800/50 border-purple-500/50 text-white"
              placeholder="Describe the effects and characteristics..."
              rows={3}
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <Label className="text-white">Effects</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentEffect}
                onChange={(e) => setCurrentEffect(e.target.value)}
                className="bg-purple-800/50 border-purple-500/50 text-white"
                placeholder="Add an effect..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEffect())}
              />
              <Button type="button" onClick={addEffect} className="bg-green-600 hover:bg-green-700">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {effects.map((effect, index) => (
                <Badge key={index} className="bg-purple-600 text-white">
                  {effect}
                  <button
                    type="button"
                    onClick={() => removeEffect(effect)}
                    className="ml-1 hover:bg-red-500 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select onValueChange={(value) => setValue('category', value as any)} defaultValue={watch('category')}>
                <SelectTrigger className="bg-purple-800/50 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mushroom">Mushroom Variety</SelectItem>
                  <SelectItem value="specialty">Specialty Product</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="potency" className="text-white">Potency</Label>
              <Select onValueChange={(value) => setValue('potency', value as any)} defaultValue={watch('potency')}>
                <SelectTrigger className="bg-purple-800/50 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Moderate-High">Moderate-High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tier" className="text-white">Tier</Label>
              <Select onValueChange={(value) => setValue('tier', value as any)} defaultValue={watch('tier')}>
                <SelectTrigger className="bg-purple-800/50 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Light Tier">Light Tier</SelectItem>
                  <SelectItem value="Medium Tier">Medium Tier</SelectItem>
                  <SelectItem value="Boomers">Boomers</SelectItem>
                  <SelectItem value="MegaBooms">MegaBooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration" className="text-white">Duration</Label>
              <Input
                {...register('duration')}
                className="bg-purple-800/50 border-purple-500/50 text-white"
                placeholder="e.g., 4-6 hours"
              />
              {errors.duration && <p className="text-red-400 text-sm">{errors.duration.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color" className="text-white">Color Gradient</Label>
              <Select onValueChange={(value) => setValue('color', value)} defaultValue={watch('color')}>
                <SelectTrigger className="bg-purple-800/50 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <ImageUpload
                value={watch('image')}
                onChange={(url) => setValue('image', url)}
                mushroomName={watch('name') || 'mushroom'}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-white">Pricing</Label>
              <Button 
                type="button" 
                onClick={addPricingEntry}
                className="bg-blue-600 hover:bg-blue-700 text-xs py-1 px-2"
              >
                Add Price
              </Button>
            </div>
            <div className="space-y-2">
              {pricingEntries.map((entry, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-gray-300 text-sm">Amount/Quantity</Label>
                    <Input
                      value={entry.key}
                      onChange={(e) => updatePricingEntry(index, 'key', e.target.value)}
                      className="bg-purple-800/50 border-purple-500/50 text-white"
                      placeholder={watch('category') === 'specialty' ? '1 Item' : '1/8'}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-gray-300 text-sm">Price</Label>
                    <Input
                      value={entry.value}
                      onChange={(e) => updatePricingEntry(index, 'value', e.target.value)}
                      className="bg-purple-800/50 border-purple-500/50 text-white"
                      placeholder="$25"
                    />
                  </div>
                  {pricingEntries.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePricingEntry(index)}
                      className="bg-red-600 hover:bg-red-700 text-xs py-2 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 text-purple-600 bg-purple-800/50 border-purple-500/50 rounded"
              />
              <Label className="text-white">Active (visible in menu)</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="outline" 
              className="border-gray-500 text-gray-300"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mushroom ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {mushroom ? 'Update' : 'Create'} Mushroom
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 