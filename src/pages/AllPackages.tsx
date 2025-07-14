import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Clock, 
  Star, 
  Package, 
  Heart, 
  Eye, 
  Zap, 
  Search, 
  Filter,
  ArrowLeft,
  Calendar,
  Users,
  Thermometer,
  Sun
} from 'lucide-react';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { useBookingAuth } from '@/hooks/useBookingAuth';
import LoginDialog from '@/components/auth/LoginDialog';

// Add seeded titles for frontend-only badge logic
const seededTitles = [
  "Paris Adventure",
  "Tokyo Discovery",
  "New York City Explorer",
  "Bali Paradise",
  "London Royal Tour",
  "Santorini Dream",
  "Dubai Luxury",
  "Machu Picchu Trek",
  "Sydney Coastal"
];

const AllPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [likedPackages, setLikedPackages] = useState<Set<number>>(new Set());
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, destinationFilter, priceFilter, typeFilter]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllPackages();
      setPackages(data);
      setFilteredPackages(data);
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    // Search by title or description
    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by destination
    if (destinationFilter) {
      filtered = filtered.filter(pkg => 
        pkg.destination.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(pkg => {
        if (max) {
          return pkg.price >= min && pkg.price <= max;
        }
        return pkg.price >= min;
      });
    }

    // Filter by package type
    if (typeFilter) {
      filtered = filtered.filter(pkg => pkg.packageType === typeFilter);
    }

    setFilteredPackages(filtered);
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Challenging': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageTypeColor = (type?: string) => {
    switch (type) {
      case 'Adventure': return 'bg-purple-100 text-purple-800';
      case 'Relaxation': return 'bg-blue-100 text-blue-800';
      case 'Cultural': return 'bg-indigo-100 text-indigo-800';
      case 'Wildlife': return 'bg-green-100 text-green-800';
      case 'Beach': return 'bg-cyan-100 text-cyan-800';
      case 'Mountain': return 'bg-slate-100 text-slate-800';
      case 'City': return 'bg-gray-100 text-gray-800';
      case 'Rural': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleLike = (packageId: number) => {
    setLikedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (packageId: number) => {
    navigate(`/packages/${packageId}`);
  };

  const handleBookNowClick = (packageId: number) => {
    handleBookNow(packageId);
  };

  // Helper to check if user is admin/agent (replace with your actual auth logic)
  const getCurrentUserRole = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.role || 'USER';
  };
  const userRole = getCurrentUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-palette-teal border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-palette-orange border-b-transparent animate-ping opacity-20"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">Loading amazing packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <Package className="w-24 h-24 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Failed to Load Packages</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={loadPackages} className="bg-palette-teal hover:bg-palette-teal/90 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center text-palette-teal hover:text-palette-teal/80 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Travel Packages</h1>
                <p className="text-gray-600">Discover amazing destinations and experiences</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Found</p>
              <p className="text-2xl font-bold text-palette-orange">{filteredPackages.length} packages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Destination Filter */}
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Destinations</SelectItem>
                <SelectItem value="Goa">Goa</SelectItem>
                <SelectItem value="Shimla">Shimla</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Himalayas">Himalayas</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                <SelectItem value="0-10000">Under ₹10,000</SelectItem>
                <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                <SelectItem value="30000-">Above ₹30,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Relaxation">Relaxation</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Beach">Beach</SelectItem>
                <SelectItem value="Mountain">Mountain</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setDestinationFilter('');
                setPriceFilter('');
                setTypeFilter('');
              }}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setDestinationFilter('');
                setPriceFilter('');
                setTypeFilter('');
              }}
                              className="bg-palette-teal hover:bg-palette-teal/90 text-white"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.packageId} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle>{pkg.title}</CardTitle>
                    {/* Show badges only for admin/agent */}
                    {(userRole === 'ADMIN' || userRole === 'AGENT') && (
                      seededTitles.includes(pkg.title) ? (
                        <Badge className="ml-2 bg-blue-100 text-blue-700">Seeded</Badge>
                      ) : (
                        <Badge className="ml-2 bg-green-100 text-green-700">Agent-added</Badge>
                      )
                    )}
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-palette-teal" />
                              <span>{pkg.destination}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-palette-orange" />
                              <span>{pkg.duration} days</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{pkg.maxGroupSize || 'Unlimited'} people</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                                          <div className="text-3xl font-bold bg-gradient-to-r from-palette-orange to-palette-teal bg-clip-text text-transparent">
                  ₹{pkg.price.toLocaleString()}
                </div>
                          <div className="text-gray-500 text-sm">per person</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{pkg.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.difficultyLevel && (
                          <Badge className={getDifficultyColor(pkg.difficultyLevel)}>
                            {pkg.difficultyLevel}
                          </Badge>
                        )}
                        {pkg.bestTimeToVisit && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Sun className="w-3 h-3 mr-1" />
                            Best: {pkg.bestTimeToVisit}
                          </Badge>
                        )}
                        {pkg.weatherInfo && (
                          <Badge className="bg-cyan-100 text-cyan-800">
                            <Thermometer className="w-3 h-3 mr-1" />
                            {pkg.weatherInfo.split(' ').slice(0, 3).join(' ')}...
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-4 border-t">
                      <Button 
                        variant="outline"
                        onClick={() => handleViewDetails(pkg.packageId)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        onClick={() => handleBookNowClick(pkg.packageId)}
                        className="flex-1 bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="mt-4 w-full bg-palette-orange hover:bg-palette-orange/90"
                    onClick={() => navigate(`/booking/${pkg.packageId}`)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <LoginDialog onAuthSuccess={onAuthSuccess}>
          <div style={{ display: 'none' }} />
        </LoginDialog>
      )}
    </div>
  );
};

export default AllPackages; 