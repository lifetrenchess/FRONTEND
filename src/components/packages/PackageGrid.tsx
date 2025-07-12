import React, { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPackages()
      .then((data) => {
        const limitedData = maxPackages ? data.slice(0, maxPackages) : data;
        setPackages(limitedData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load packages');
        setLoading(false);
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

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg mb-4">⚠️</div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-[#01E8B2] hover:underline"
        >
          Try again
        </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.packageId} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageGrid; 