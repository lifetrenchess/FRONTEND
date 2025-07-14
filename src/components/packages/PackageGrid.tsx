import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { fetchAllPackages, TravelPackageDto, mockPackages } from '@/lib/packagesApi';
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
        setPackages(mockPackages);
        setLoading(false);
      });
  }, [maxPackages]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-teal mx-auto"></div>
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
                <span key={index} className="text-palette-teal">{word}</span>
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
                <Button className="bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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