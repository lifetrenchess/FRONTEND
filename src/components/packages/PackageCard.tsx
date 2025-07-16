import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Package, Heart, Eye, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TravelPackageDto } from '@/lib/packagesApi';

interface PackageCardProps {
  pkg: TravelPackageDto;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  // Persist wishlist in localStorage
  const getWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) as number[] : [];
  };
  const [isLiked, setIsLiked] = useState(() => getWishlist().includes(pkg.packageId));

  useEffect(() => {
    // Keep isLiked in sync with localStorage changes (e.g., from other tabs)
    const syncWishlist = () => setIsLiked(getWishlist().includes(pkg.packageId));
    window.addEventListener('storage', syncWishlist);
    return () => window.removeEventListener('storage', syncWishlist);
  }, [pkg.packageId]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = getWishlist();
    let updated;
    if (wishlist.includes(pkg.packageId)) {
      updated = wishlist.filter(id => id !== pkg.packageId);
      setIsLiked(false);
    } else {
      updated = [...wishlist, pkg.packageId];
      setIsLiked(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getPackageTypeColor = (type?: string) => {
    switch (type) {
      case 'Adventure': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Relaxation': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'Cultural': return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'Wildlife': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'Beach': return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
      case 'Mountain': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
      case 'City': return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
      case 'Rural': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  return (
    <div className="relative">
      <Card 
        className={`overflow-hidden transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl group cursor-pointer ${
          isHovered ? 'shadow-xl' : 'shadow-lg'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          // Prevent like button from triggering card click
          if ((e.target as HTMLElement).closest('.like-btn')) return;
          navigate(`/packages/${pkg.packageId}`);
        }}
      >
        <div className="relative">
          {pkg.mainImage && (
            <div className="relative overflow-hidden">
              <img 
                src={pkg.mainImage} 
                alt={pkg.title} 
                className={`w-full h-64 object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              {/* Floating Action Buttons */}
              <div className={`absolute top-4 right-4 flex space-x-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWishlist}
                  className={`like-btn w-8 h-8 p-0 rounded-full backdrop-blur-sm ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                  } transition-all duration-300`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
              </div>

                          {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-palette-teal to-palette-orange text-white px-3 py-1 backdrop-blur-sm animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>

              {/* View Overlay (clickable) */}
              <Link to={`/packages/${pkg.packageId}`} className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`} onClick={e => e.stopPropagation()}>
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">View Details</span>
                </div>
              </Link>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-palette-teal transition-colors duration-300 line-clamp-2">
              {pkg.title}
            </h3>
          </div>
          
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
            <MapPin className="w-4 h-4 text-palette-teal" />
            <span className="text-sm font-medium">{pkg.destination}</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="w-4 h-4 text-palette-orange" />
            <span className="text-sm font-medium">{pkg.duration} days</span>
          </div>
        </div>

          {/* Package Type Badge */}
          {pkg.packageType && (
            <div className="mb-4">
              <Badge className={`${getPackageTypeColor(pkg.packageType)} px-3 py-1 text-sm font-medium shadow-lg`}>
                <Package className="w-3 h-3 mr-1" />
                {pkg.packageType}
              </Badge>
            </div>
          )}
          
                  <div className="mb-4 text-gray-700 text-sm line-clamp-3 leading-relaxed">
          {pkg.description}
        </div>
        
        {pkg.highlights && (
          <div className="mb-4 p-3 bg-gradient-to-r from-palette-teal/10 to-palette-orange/10 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">Highlights:</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{pkg.highlights}</p>
          </div>
        )}

        {/* Included Services Summary */}
        {pkg.includeService && (
          <div className="mb-4 p-2 bg-green-50 border border-green-100 rounded-lg flex items-center space-x-2">
            <Package className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Includes: {pkg.includeService}</span>
          </div>
        )}

          {/* Rating Stars */}
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.8)</span>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6 flex justify-between items-center">
                  <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-palette-orange to-palette-teal bg-clip-text text-transparent">
            ₹{pkg.price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">per person</span>
        </div>
        <Link to="/packages">
          <Button className="bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group-hover:scale-110">
            <Eye className="w-4 h-4 mr-2" />
            View Packages
          </Button>
        </Link>
        </CardFooter>

              {/* Hover Border Effect */}
      <div className={`absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-500 ${
        isHovered ? 'border-palette-teal/30' : ''
      }`}></div>
      </Card>
    </div>
  );
};

export default PackageCard; 