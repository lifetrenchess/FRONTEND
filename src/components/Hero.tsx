
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchAllPackages } from '@/lib/packagesApi';

const Hero = () => {
  const [destinations, setDestinations] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all packages and extract unique destinations
    fetchAllPackages().then((packages) => {
      const uniqueDestinations = Array.from(new Set(packages.map(pkg => pkg.destination)));
      setDestinations(uniqueDestinations);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('selectedGuests', String(guests));
    const params = new URLSearchParams();
    if (selectedDestination) params.append('destination', selectedDestination);
    params.append('guests', String(guests));
    navigate(`/packages?${params.toString()}`);
  };

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
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-palette-teal mb-1" />
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <select
                    className="w-full bg-transparent text-gray-900 focus:outline-none text-center"
                    value={selectedDestination}
                    onChange={e => setSelectedDestination(e.target.value)}
                  >
                    <option value="">Where to?</option>
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg">
                  <Users className="w-5 h-5 text-palette-teal mb-1" />
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <select
                    className="w-full bg-transparent text-gray-900 focus:outline-none text-center"
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                  >
                    {[1,2,3,4].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6 bg-palette-orange hover:bg-palette-orange/90 text-white py-3 text-lg">
              <Search className="w-5 h-5 mr-2" />
              Search Packages
            </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Hero;
