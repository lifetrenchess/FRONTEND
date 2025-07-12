// Package data for dynamic package details pages
export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  location: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  highlights?: string[];
  itinerary?: ItineraryItem[];
}

export const packages: TravelPackage[] = [
  {
    id: 'goa',
    title: 'Goa',
    location: 'Goa, India',
    description: `India's beach capital with upscale resorts, vibrant nightlife, and Portuguese charm.`,
    duration: '5 days',
    price: '₹35,000',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    highlights: ['Upscale Resorts', 'Nightlife', 'Portuguese Heritage', 'Beaches'],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Leisure', description: 'Arrive in Goa, check-in to your resort, and relax on the beach.' },
      { day: 2, title: 'North Goa Sightseeing', description: 'Explore Calangute, Baga, and Anjuna beaches. Visit Fort Aguada and enjoy water sports.' },
      { day: 3, title: 'South Goa Heritage', description: 'Visit Colva Beach, Basilica of Bom Jesus, and explore Portuguese architecture.' },
      { day: 4, title: 'Nightlife & Markets', description: 'Experience Goa’s vibrant nightlife and shop at local flea markets.' },
      { day: 5, title: 'Departure', description: 'Relax at the resort before your departure.' },
    ]
  },
  {
    id: 'gulmarg',
    title: 'Gulmarg, Jammu & Kashmir',
    location: 'Jammu & Kashmir, India',
    description: `Snowy luxury retreat for skiing, cable cars, and Himalayan views.`,
    duration: '4 days',
    price: '₹40,000',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Skiing', 'Cable Cars', 'Himalayan Views', 'Luxury Retreat'],
    itinerary: [
      { day: 1, title: 'Arrival & Snow Walks', description: 'Arrive in Gulmarg, check-in, and enjoy a walk in the snow.' },
      { day: 2, title: 'Gondola Ride & Skiing', description: 'Take the famous Gulmarg Gondola and try skiing or snowboarding.' },
      { day: 3, title: 'Explore Local Sights', description: 'Visit St. Mary’s Church, Maharani Temple, and local markets.' },
      { day: 4, title: 'Departure', description: 'Enjoy Himalayan views before departure.' },
    ]
  },
  {
    id: 'kovalam',
    title: 'Kovalam, Kerala',
    location: 'Kerala, India',
    description: `Serene beaches with Ayurvedic spas and cliffside resorts.`,
    duration: '6 days',
    price: '₹45,000',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Ayurvedic Spas', 'Cliffside Resorts', 'Serene Beaches'],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Relaxation', description: 'Arrive in Kovalam, check-in, and relax at Lighthouse Beach.' },
      { day: 2, title: 'Ayurvedic Spa Day', description: 'Enjoy a rejuvenating Ayurvedic spa session.' },
      { day: 3, title: 'Backwater Cruise', description: 'Take a scenic backwater cruise in Poovar.' },
      { day: 4, title: 'Cultural Tour', description: 'Visit local temples and art galleries.' },
      { day: 5, title: 'Cliffside Dining', description: 'Dine at a cliffside restaurant with ocean views.' },
      { day: 6, title: 'Departure', description: 'Relax at the resort before departure.' },
    ]
  },
  {
    id: 'shimla',
    title: 'Shimla, Himachal Pradesh',
    location: 'Himachal Pradesh, India',
    description: `Colonial hill station with luxury retreats and scenic toy train rides.`,
    duration: '7 days',
    price: '₹50,000',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    highlights: ['Colonial Retreats', 'Toy Train', 'Hill Station'],
    itinerary: [
      { day: 1, title: 'Arrival & Mall Road', description: 'Arrive in Shimla, stroll along Mall Road, and check-in.' },
      { day: 2, title: 'Toy Train Experience', description: 'Enjoy a scenic ride on the Shimla-Kalka toy train.' },
      { day: 3, title: 'Jakhoo Temple & Ridge', description: 'Visit Jakhoo Temple and the Ridge for panoramic views.' },
      { day: 4, title: 'Colonial Heritage Walk', description: 'Explore colonial buildings and Christ Church.' },
      { day: 5, title: 'Day Trip to Kufri', description: 'Excursion to Kufri for adventure activities.' },
      { day: 6, title: 'Local Markets', description: 'Shop for handicrafts and souvenirs.' },
      { day: 7, title: 'Departure', description: 'Relax and depart from Shimla.' },
    ]
  },
  {
    id: 'darjeeling',
    title: 'Darjeeling, West Bengal',
    location: 'West Bengal, India',
    description: `Tea estates, luxury stays, and views of Kanchenjunga.`,
    duration: '4 days',
    price: '₹36,000',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    highlights: ['Tea Estates', 'Luxury Stays', 'Kanchenjunga Views'],
    itinerary: [
      { day: 1, title: 'Arrival & Tea Estate Tour', description: 'Arrive in Darjeeling, check-in, and tour a tea estate.' },
      { day: 2, title: 'Tiger Hill Sunrise', description: 'Early morning visit to Tiger Hill for sunrise over Kanchenjunga.' },
      { day: 3, title: 'Himalayan Railway', description: 'Ride the Darjeeling Himalayan Railway and visit Ghoom Monastery.' },
      { day: 4, title: 'Local Markets & Departure', description: 'Shop at Chowrasta and depart.' },
    ]
  },
  {
    id: 'havelock',
    title: 'Havelock Island, Andaman & Nicobar',
    location: 'Andaman & Nicobar, India',
    description: `Tropical paradise with scuba diving and luxury beachfront resorts.`,
    duration: '5 days',
    price: '₹60,000',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    highlights: ['Scuba Diving', 'Beachfront Resorts', 'Tropical Paradise'],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Leisure', description: 'Arrive at Havelock, check-in, and relax at Radhanagar Beach.' },
      { day: 2, title: 'Scuba Diving', description: 'Enjoy a guided scuba diving session.' },
      { day: 3, title: 'Elephant Beach', description: 'Visit Elephant Beach for snorkeling and water sports.' },
      { day: 4, title: 'Island Hopping', description: 'Take a boat tour to nearby islands.' },
      { day: 5, title: 'Departure', description: 'Relax at the resort before departure.' },
    ]
  },
  {
    id: 'coorg',
    title: 'Coorg, Karnataka',
    location: 'Karnataka, India',
    description: `Misty hills, coffee plantations, and boutique luxury resorts.`,
    duration: '4 days',
    price: '₹37,000',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80',
    highlights: ['Coffee Plantations', 'Misty Hills', 'Luxury Resorts'],
    itinerary: [
      { day: 1, title: 'Arrival & Coffee Estate', description: 'Arrive in Coorg, check-in, and tour a coffee estate.' },
      { day: 2, title: 'Abbey Falls & Raja’s Seat', description: 'Visit Abbey Falls and enjoy sunset at Raja’s Seat.' },
      { day: 3, title: 'Dubare Elephant Camp', description: 'Interact with elephants at Dubare Elephant Camp.' },
      { day: 4, title: 'Local Markets & Departure', description: 'Shop for coffee and spices before departure.' },
    ]
  },
  {
    id: 'jaisalmer',
    title: 'The Golden City – Jaisalmer, Rajasthan',
    location: 'Rajasthan, India',
    description: `Sand dunes, camel safaris, and luxury desert camps.`,
    duration: '6 days',
    price: '₹48,000',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    highlights: ['Sand Dunes', 'Camel Safaris', 'Desert Camps'],
    itinerary: [
      { day: 1, title: 'Arrival & Fort Visit', description: 'Arrive in Jaisalmer, check-in, and visit Jaisalmer Fort.' },
      { day: 2, title: 'Havelis & Markets', description: 'Explore Patwon Ki Haveli and local markets.' },
      { day: 3, title: 'Sam Sand Dunes', description: 'Camel safari and sunset at Sam Sand Dunes.' },
      { day: 4, title: 'Desert Camp Experience', description: 'Stay in a luxury desert camp with cultural performances.' },
      { day: 5, title: 'Gadisar Lake & Temples', description: 'Visit Gadisar Lake and Jain Temples.' },
      { day: 6, title: 'Departure', description: 'Relax and depart from Jaisalmer.' },
    ]
  },
  {
    id: 'pondicherry',
    title: 'The French Riviera of the East – Pondicherry',
    location: 'Pondicherry, India',
    description: `Colonial architecture, beachside cafes, and boutique stays.`,
    duration: '3 days',
    price: '₹30,000',
    image: 'https://images.unsplash.com/photo-1504609813440-554e64a8f005?auto=format&fit=crop&w=800&q=80',
    highlights: ['Colonial Architecture', 'Beachside Cafes', 'Boutique Stays'],
    itinerary: [
      { day: 1, title: 'Arrival & Promenade', description: 'Arrive in Pondicherry, check-in, and stroll along the Promenade Beach.' },
      { day: 2, title: 'French Quarter & Cafes', description: 'Explore the French Quarter and dine at beachside cafes.' },
      { day: 3, title: 'Auroville & Departure', description: 'Visit Auroville and depart from Pondicherry.' },
    ]
  }
]; 