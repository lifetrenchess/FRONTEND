
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const destinations = [
  {
    name: "Mountain Escapes",
    count: "12 Packages",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=600&fit=crop",
    gradient: "from-palette-teal/80 to-transparent"
  },
  {
    name: "Beach Paradise",
    count: "18 Packages", 
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=600&fit=crop",
    gradient: "from-palette-orange/80 to-transparent"
  },
  {
    name: "City Adventures",
    count: "24 Packages",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&h=600&fit=crop",
    gradient: "from-palette-peach/80 to-transparent"
  }
];

const Destinations = () => {
  const navigate = useNavigate();
  return (
    <section id="destinations" className="py-20 bg-palette-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular <span className="text-palette-teal">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From serene beaches to majestic mountains, discover your perfect getaway
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {destinations.map((destination, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-96">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${destination.gradient}`}></div>
                
                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-palette-orange hover:bg-palette-orange/90 text-white px-8 py-3"
            onClick={() => navigate('/packages')}
          >
            View All Destinations
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
