
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Your Next
          <span className="text-palette-orange block">Adventure</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Curated travel experiences that create memories for a lifetime
        </p>
        
        {/* Search Bar */}
        <Card className="bg-palette-cream/95 backdrop-blur-sm shadow-2xl max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <MapPin className="w-5 h-5 text-palette-teal" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <select className="w-full bg-transparent text-gray-900 focus:outline-none">
                    <option>Where to?</option>
                    <option>Bali, Indonesia</option>
                    <option>Paris, France</option>
                    <option>Tokyo, Japan</option>
                    <option>New York, USA</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-palette-teal" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-in</label>
                  <input type="date" className="w-full bg-transparent text-gray-900 focus:outline-none" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-palette-teal" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-out</label>
                  <input type="date" className="w-full bg-transparent text-gray-900 focus:outline-none" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Users className="w-5 h-5 text-palette-teal" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <select className="w-full bg-transparent text-gray-900 focus:outline-none">
                    <option>2 Adults</option>
                    <option>1 Adult</option>
                    <option>3 Adults</option>
                    <option>4+ Adults</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-palette-orange hover:bg-palette-orange/90 text-white py-3 text-lg">
              <Search className="w-5 h-5 mr-2" />
              Search Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Hero;
