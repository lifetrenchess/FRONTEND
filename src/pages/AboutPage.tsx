import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Shield, 
  CreditCard, 
  Star, 
  Users, 
  Plane, 
  Heart, 
  Globe,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Diverse Packages',
      description: 'Explore a wide range of curated and customizable travel itineraries.'
    },
    {
      icon: Heart,
      title: 'Tailored Adventures',
      description: 'Flexibly build or modify packages to suit your unique preferences.'
    },
    {
      icon: Shield,
      title: 'Seamless Protection',
      description: 'Comprehensive travel insurance for ultimate peace of mind.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Dedicated assistance available whenever you need it, worldwide.'
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Secure and convenient options for all your booking transactions.'
    },
    {
      icon: Star,
      title: 'Trusted Reviews',
      description: 'Transparent ratings help you choose the best, most comfortable trips.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Travelers' },
    { number: '100+', label: 'Destinations' },
    { number: '24/7', label: 'Support' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-palette-teal to-palette-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Aventra Travel & Explore</h1>
            <p className="text-xl text-palette-cream/90 max-w-3xl mx-auto leading-relaxed">
              Welcome to <strong>Aventra Travel & Explore</strong>, your premier destination for crafting seamless and memorable journeys. We are dedicated to redefining how you explore the world.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Features Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-palette-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-palette-teal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tailored Travel Experiences</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover a vast selection of expertly curated travel packages, or design your own with our flexible customization options to perfectly match your wanderlust.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-palette-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-palette-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Peace of Mind</h3>
                <p className="text-gray-600 leading-relaxed">
                  Journey confidently with our comprehensive travel insurance and enjoy 24/7 dedicated assistance, ensuring a smooth and worry-free adventure from start to finish.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-palette-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-palette-teal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Effortless Booking & Trust</h3>
                <p className="text-gray-600 leading-relaxed">
                  Benefit from multiple secure payment methods and make informed choices with transparent ratings and reviews from our global community of travelers.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-700 font-medium">
              Your extraordinary adventure awaits. Start planning with Aventra today.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Aventra Travel & Explore?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than just bookings; we're your partner in crafting exceptional travel experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-palette-teal/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-palette-teal" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-palette-teal to-palette-orange text-white">
            <CardContent className="p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-palette-cream/90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              To inspire and enable extraordinary travel experiences by providing personalized, reliable, and innovative travel solutions that connect people with the world's most amazing destinations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-700">Personalized travel planning</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-700">24/7 customer support</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-700">Comprehensive travel insurance</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-palette-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-palette-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Excellence</h4>
                  <p className="text-gray-600 text-sm">We strive for excellence in every aspect of our service.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-palette-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-palette-teal" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer First</h4>
                  <p className="text-gray-600 text-sm">Our customers are at the heart of everything we do.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-palette-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-palette-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Global Perspective</h4>
                  <p className="text-gray-600 text-sm">We embrace diversity and global perspectives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-palette-teal to-palette-orange text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-xl text-palette-cream/90 mb-8">
                Join thousands of travelers who trust Aventra for their adventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-palette-teal hover:bg-gray-100"
                >
                  <Plane className="w-5 h-5 mr-2" />
                  Explore Packages
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-palette-teal"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 