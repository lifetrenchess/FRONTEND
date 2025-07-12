
import React from 'react';
import PackageGrid from './packages/PackageGrid';

const FeaturedPackages = () => {
  return (
    <PackageGrid 
      title="Featured Packages"
      subtitle="Handpicked destinations and experiences crafted for unforgettable journeys"
      maxPackages={6}
    />
  );
};

export default FeaturedPackages;
