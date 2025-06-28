import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useSupabaseMushrooms } from '@/contexts/SupabaseMushroomContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, AlertCircle, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { MushroomForm } from '@/components/admin/MushroomForm';
import { MushroomVariety } from '@/types/mushroom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Admin = () => {
  const { mushrooms, loading, error, deleteMushroom, toggleMushroomActive } = useSupabaseMushrooms();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMushroom, setEditingMushroom] = useState<MushroomVariety | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    potency: 'all',
    tier: 'all',
    category: 'all',
    activeStatus: 'all' // 'all', 'active', 'inactive'
  });
  
  // Sort states
  const [sortBy, setSortBy] = useState<'active' | 'name' | 'createdAt'>('active');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showFilters, setShowFilters] = useState(false);

  const handleEdit = (mushroom: MushroomVariety) => {
    setEditingMushroom(mushroom);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this mushroom variety?')) {
      deleteMushroom(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMushroom(null);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      potency: 'all',
      tier: 'all',
      category: 'all',
      activeStatus: 'all'
    });
  };

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

  // Get unique values for filter options
  const uniqueValues = useMemo(() => {
    const potencies = [...new Set(mushrooms.map(m => m.potency).filter(Boolean))];
    const tiers = [...new Set(mushrooms.map(m => m.tier).filter(Boolean))];
    const categories = [...new Set(mushrooms.map(m => m.category).filter(Boolean))];
    
    return { potencies, tiers, categories };
  }, [mushrooms]);

  // Filter and sort mushrooms
  const filteredAndSortedMushrooms = useMemo(() => {
    let filtered = mushrooms.filter(mushroom => {
      // Name filter (case insensitive)
      if (filters.name && !mushroom.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Potency filter
      if (filters.potency !== 'all' && mushroom.potency !== filters.potency) {
        return false;
      }
      
      // Tier filter
      if (filters.tier !== 'all' && mushroom.tier !== filters.tier) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'all' && mushroom.category !== filters.category) {
        return false;
      }
      
      // Active status filter
      if (filters.activeStatus === 'active' && !mushroom.isActive) {
        return false;
      }
      if (filters.activeStatus === 'inactive' && mushroom.isActive) {
        return false;
      }
      
      return true;
    });

    // Sort mushrooms
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'active':
          comparison = (a.isActive === b.isActive) ? 0 : a.isActive ? 1 : -1;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mushrooms, filters, sortBy, sortOrder]);

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/40 to-black">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Mobile-friendly header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm sm:text-base">Manage your mushroom menu items</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="w-full sm:w-auto bg-purple-600/20 border-purple-500 text-white hover:bg-purple-600/40 text-sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-purple-600/20 border-purple-500 text-white hover:bg-purple-600/40 text-sm"
                onClick={() => setShowFilters(f => !f)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </SignedIn>
          </div>
        </div>

        <SignedOut>
          <Card className="bg-purple-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Authentication Required</CardTitle>
              <CardDescription className="text-gray-300">
                Please sign in to access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton>
                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Sign In to Continue
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </SignedOut>

        <SignedIn>
          {error && (
            <Alert className="mb-6 bg-red-900/30 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Mobile-friendly action bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm"
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Mushroom
            </Button>

            <div className="flex items-center justify-center sm:justify-end">
              <span className="text-gray-300 text-sm">
                {filteredAndSortedMushrooms.length} of {mushrooms.length} mushrooms
              </span>
            </div>
          </div>

          {/* Mobile-optimized filters */}
          {showFilters && (
            <Card className="mb-6 bg-purple-900/30 border-purple-500/30">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-purple-400" />
                    <CardTitle className="text-white text-lg">Filters & Sorting</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="bg-purple-600 text-white">
                        {activeFiltersCount} active
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white self-start sm:self-auto"
                    disabled={activeFiltersCount === 0}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Name Filter */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Name</label>
                    <Input
                      placeholder="Search by name..."
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-purple-800/50 border-purple-500/30 text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Potency Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Potency</label>
                    <Select value={filters.potency} onValueChange={(value) => setFilters(prev => ({ ...prev, potency: value }))}>
                      <SelectTrigger className="bg-purple-800/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="All potencies" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-500">
                        <SelectItem value="all">All potencies</SelectItem>
                        {uniqueValues.potencies.map(potency => (
                          <SelectItem key={potency} value={potency}>{potency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tier Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Tier</label>
                    <Select value={filters.tier} onValueChange={(value) => setFilters(prev => ({ ...prev, tier: value }))}>
                      <SelectTrigger className="bg-purple-800/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="All tiers" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-500">
                        <SelectItem value="all">All tiers</SelectItem>
                        {uniqueValues.tiers.map(tier => (
                          <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-purple-800/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-500">
                        <SelectItem value="all">All categories</SelectItem>
                        {uniqueValues.categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Status Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
                    <Select value={filters.activeStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, activeStatus: value }))}>
                      <SelectTrigger className="bg-purple-800/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-500">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active only</SelectItem>
                        <SelectItem value="inactive">Inactive only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Sort by</label>
                    <Select value={sortBy} onValueChange={(value: 'active' | 'name' | 'createdAt') => setSortBy(value)}>
                      <SelectTrigger className="bg-purple-800/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-500">
                        <SelectItem value="active">Active Status</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Order</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="w-full bg-purple-800/50 border-purple-500/30 text-white hover:bg-purple-800/70"
                    >
                      {sortOrder === 'asc' ? (
                        <>
                          <SortAsc className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Ascending</span>
                          <span className="sm:hidden">Asc</span>
                        </>
                      ) : (
                        <>
                          <SortDesc className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Descending</span>
                          <span className="sm:hidden">Desc</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <span className="ml-2 text-gray-300">Loading mushrooms...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedMushrooms.map((mushroom) => (
              <Card 
                key={mushroom.id} 
                className={`bg-purple-900/30 border-purple-500/30 ${!mushroom.isActive ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-base sm:text-lg break-words">{mushroom.name}</CardTitle>
                      <CardDescription className="text-gray-300 text-xs sm:text-sm break-words">
                        {mushroom.scientific}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 sm:gap-2 self-start">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleMushroomActive(mushroom.id)}
                        className="text-gray-300 hover:text-white h-8 w-8 p-0 sm:h-9 sm:w-9"
                        disabled={loading}
                      >
                        {mushroom.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(mushroom)}
                        className="text-blue-400 hover:text-blue-300 h-8 w-8 p-0 sm:h-9 sm:w-9"
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(mushroom.id)}
                        className="text-red-400 hover:text-red-300 h-8 w-8 p-0 sm:h-9 sm:w-9"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-3">{mushroom.description}</p>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                    <Badge className={`${getPotencyColor(mushroom.potency)} text-white text-xs`}>
                      {mushroom.potency}
                    </Badge>
                    <Badge className={`${getTierColor(mushroom.tier)} text-white text-xs`}>
                      {mushroom.tier}
                    </Badge>
                    {mushroom.category && (
                      <Badge className="bg-purple-600 text-white text-xs">
                        {mushroom.category}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs">Duration: {mushroom.duration}</p>
                    {mushroom.pricing && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                        {Object.entries(mushroom.pricing).map(([amount, price]) => (
                          <div key={amount} className="text-gray-300 flex justify-between sm:block">
                            <span className="font-medium">{amount}:</span>
                            <span className="sm:ml-1">{price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {mushroom.image && (
                      <div className="mt-2">
                        <img 
                          src={mushroom.image} 
                          alt={mushroom.name}
                          className="w-full h-20 sm:h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400 space-y-1">
                    <p>Created: {new Date(mushroom.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(mushroom.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {filteredAndSortedMushrooms.length === 0 && mushrooms.length > 0 && (
            <Card className="bg-purple-900/30 border-purple-500/30">
              <CardContent className="text-center py-8 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg mb-4">No mushrooms match your current filters</p>
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="bg-purple-600/20 border-purple-500 text-white hover:bg-purple-600/40 w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {mushrooms.length === 0 && (
            <Card className="bg-purple-900/30 border-purple-500/30">
              <CardContent className="text-center py-8 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg mb-4">No mushroom varieties found</p>
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Mushroom
                </Button>
              </CardContent>
            </Card>
          )}

          {isFormOpen && (
            <MushroomForm 
              mushroom={editingMushroom} 
              onClose={handleFormClose}
            />
          )}
        </SignedIn>
      </div>
    </div>
  );
};

export default Admin; 