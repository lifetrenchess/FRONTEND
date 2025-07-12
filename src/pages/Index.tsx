
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedPackages from '@/components/FeaturedPackages';
import Destinations from '@/components/Destinations';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedPackages />
      <Destinations />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
