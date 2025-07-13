import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import PackageCard from './PackageCard';

interface PackageGridProps {
  title?: string;
  subtitle?: string;
  maxPackages?: number;
}

const PackageGrid = ({ 
  title = "Featured Packages", 
  subtitle = "Handpicked destinations and experiences crafted for unforgettable journeys",
  maxPackages 
}: PackageGridProps) => {
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('PackageGrid: Starting to fetch packages...');
    fetchAllPackages()
      .then((data) => {
        console.log('PackageGrid: Packages received:', data);
        const limitedData = maxPackages ? data.slice(0, maxPackages) : data;
        console.log('PackageGrid: Limited packages to display:', limitedData);
        setPackages(limitedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('PackageGrid: Error fetching packages:', err);
        console.log('PackageGrid: Using fallback mock data');
        // Use fallback mock data instead of showing error
        const fallbackData = [
          {
            packageId: 1,
            title: 'Goa Beach Paradise',
            description: 'Experience the perfect beach vacation in Goa with pristine beaches and vibrant nightlife.',
            duration: 5,
            price: 15000,
            destination: 'Goa',
            includeService: 'Hotel, Meals, Transport, Guide',
            highlights: 'Beach Activities, Water Sports, Nightlife',
            active: true,
            mainImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
            flights: [],
            hotels: [],
            sightseeingList: []
          },
          {
            packageId: 2,
            title: 'Shimla Mountain Adventure',
            description: 'Explore the beautiful mountains of Shimla with trekking and adventure activities.',
            duration: 4,
            price: 12000,
            destination: 'Shimla',
            includeService: 'Hotel, Meals, Transport, Guide',
            highlights: 'Mountain Trekking, Adventure Sports, Scenic Views',
            active: true,
            mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
            flights: [],
            hotels: [],
            sightseeingList: []
          },
          {
            packageId: 3,
            title: 'Kerala Backwaters Experience',
            description: 'Discover the serene backwaters of Kerala with traditional houseboat stays.',
            duration: 6,
            price: 18000,
            destination: 'Kerala',
            includeService: 'Houseboat, Meals, Transport, Guide',
            highlights: 'Houseboat Cruise, Ayurvedic Massage, Kathakali Performance',
            active: true,
            mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
            flights: [],
            hotels: [],
            sightseeingList: []
          }
        ];
        const limitedFallbackData = maxPackages ? fallbackData.slice(0, maxPackages) : fallbackData;
        setPackages(limitedFallbackData);
        setLoading(false);
        // Don't set error, just use fallback data
      });
  }, [maxPackages]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01E8B2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading packages...</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title.split(' ').map((word, index) => 
              index === 1 ? (
                <span key={index} className="text-[#01E8B2]">{word}</span>
              ) : (
                <span key={index}>{word}</span>
              )
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">📦</div>
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.packageId} pkg={pkg} />
              ))}
            </div>
            
            {/* View All Packages Button */}
            <div className="text-center mt-12">
              <Link to="/packages">
                <Button className="bg-gradient-to-r from-[#01E8B2] to-[#00d4a1] hover:from-[#00d4a1] hover:to-[#01E8B2] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  View All Packages
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PackageGrid; 