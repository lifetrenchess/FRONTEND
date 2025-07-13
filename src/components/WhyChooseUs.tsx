
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Star, Headphones, Globe } from 'lucide-react';
import FlippingCard from './FlippingCard';

const features = [
  {
    icon: Shield,
    title: "Trusted & Secure",
    description: "Your bookings are protected with our secure payment system and comprehensive travel insurance.",
    color: "text-palette-teal"
  },
  {
    icon: Star,
    title: "Premium Experiences",
    description: "Handpicked accommodations and activities that exceed expectations every time.",
    color: "text-palette-orange"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated travel experts are available around the clock to assist you.",
    color: "text-palette-peach"
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access to exclusive destinations and local experiences worldwide.",
    color: "text-palette-teal"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-palette-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-palette-teal">Aventra</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just another travel company. We're your partners in creating extraordinary memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <FlippingCard
                key={index}
                icon={<IconComponent className={`w-10 h-10 ${feature.color}`} />}
                title={feature.title}
                description={feature.description}
              />
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-teal">50K+</div>
              <div className="text-sm text-gray-600">Happy Travelers</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-orange">200+</div>
              <div className="text-sm text-gray-600">Destinations</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-peach">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
