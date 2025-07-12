import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPackageById, TravelPackageDto, FlightDto, HotelDto, SightseeingDto } from '@/lib/packagesApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Star, 
  Plane, 
  Hotel, 
  Camera, 
  Users, 
  Calendar,
  Thermometer,
  Package,
  Shield,
  FileText,
  Luggage,
  Sun,
  Heart,
  Share2,
  Eye,
  Zap,
  Award,
  Globe
} from 'lucide-react';
import { useBookingAuth } from '@/hooks/useBookingAuth';
import LoginDialog from '@/components/auth/LoginDialog';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pkg, setPkg] = useState<TravelPackageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();
  const isBookingIntent = searchParams.get('booking') === 'true';

  useEffect(() => {
    if (!id) return;
    fetchPackageById(Number(id))
      .then((data) => {
        setPkg(data);
        setSelectedImage(data.mainImage || '');
        setLoading(false);
        // Trigger animations after data loads
        setTimeout(() => setAnimateHeader(true), 100);
        setTimeout(() => setAnimateContent(true), 300);
      })
      .catch(() => {
        setError('Package not found');
        setLoading(false);
      });
  }, [id]);

  const getImages = (): string[] => {
    if (!pkg) return [];
    const images = [];
    if (pkg.mainImage) images.push(pkg.mainImage);
    if (pkg.images) {
      try {
        const additionalImages = JSON.parse(pkg.images);
        if (Array.isArray(additionalImages)) {
          images.push(...additionalImages);
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e);
      }
    }
    return images;
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Challenging': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageTypeColor = (type?: string) => {
    switch (type) {
      case 'Adventure': return 'bg-purple-100 text-purple-800';
      case 'Relaxation': return 'bg-blue-100 text-blue-800';
      case 'Cultural': return 'bg-indigo-100 text-indigo-800';
      case 'Wildlife': return 'bg-green-100 text-green-800';
      case 'Beach': return 'bg-cyan-100 text-cyan-800';
      case 'Mountain': return 'bg-slate-100 text-slate-800';
      case 'City': return 'bg-gray-100 text-gray-800';
      case 'Rural': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg?.title,
        text: `Check out this amazing travel package: ${pkg?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#01E8B2] border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-[#964734] border-b-transparent animate-ping opacity-20"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">Loading your dream destination...</p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center animate-bounce">
          <Globe className="w-24 h-24 text-red-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Package Not Found</h2>
          <p className="text-gray-600 mb-8">The package you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="bg-[#01E8B2] hover:bg-[#00d4a1] text-white px-8 py-3 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Animation */}
      <div className={`bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 transition-all duration-1000 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-[#01E8B2] hover:text-[#00d4a1] transition-colors duration-300 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Packages</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`transition-all duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-[#01E8B2] transition-colors duration-300"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-1000 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Package Header */}
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="relative bg-gradient-to-r from-[#01E8B2]/10 to-[#964734]/10 p-8">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-[#01E8B2] to-[#964734] text-white px-4 py-2 animate-pulse">
                    <Zap className="w-4 h-4 mr-2" />
                    Featured Package
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {pkg.title}
                      </h1>
                      <div className="flex items-center space-x-6 text-gray-600 mb-4">
                        <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
                          <MapPin className="w-4 h-4 text-[#01E8B2]" />
                          <span className="font-medium">{pkg.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
                          <Clock className="w-4 h-4 text-[#964734]" />
                          <span className="font-medium">{pkg.duration} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#964734] to-[#01E8B2] bg-clip-text text-transparent">
                        ₹{pkg.price.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-sm">per person</div>
                    </div>
                  </div>

                  {/* Enhanced Package Type and Difficulty Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {pkg.packageType && (
                      <Badge className={`${getPackageTypeColor(pkg.packageType)} px-4 py-2 text-sm font-medium animate-fade-in`}>
                        <Package className="w-4 h-4 mr-2" />
                        {pkg.packageType}
                      </Badge>
                    )}
                    {pkg.difficultyLevel && (
                      <Badge className={`${getDifficultyColor(pkg.difficultyLevel)} px-4 py-2 text-sm font-medium animate-fade-in`}>
                        <Award className="w-4 h-4 mr-2" />
                        {pkg.difficultyLevel}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed text-lg">{pkg.description}</p>
                </CardContent>
              </div>
            </Card>

            {/* Enhanced Image Gallery */}
            {images.length > 0 && (
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="flex items-center text-gray-800">
                    <Camera className="w-6 h-6 mr-3 text-[#01E8B2]" />
                    Photo Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Main Image with Enhanced Styling */}
                    <div className="relative group overflow-hidden rounded-xl">
                      <img 
                        src={selectedImage} 
                        alt={pkg.title} 
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* Enhanced Thumbnail Images */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              selectedImage === image ? 'ring-2 ring-[#01E8B2] ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`${pkg.title} ${index + 1}`}
                              className="w-full h-20 object-cover transition-opacity duration-300"
                            />
                            <div className={`absolute inset-0 transition-opacity duration-300 ${
                              selectedImage === image ? 'bg-[#01E8B2]/20' : 'bg-black/0 hover:bg-black/10'
                            }`}></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Detailed Information Tabs */}
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-6">
                <Tabs defaultValue="itinerary" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-50 to-blue-50 p-1 rounded-lg">
                    <TabsTrigger value="itinerary" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300">
                      <Plane className="w-4 h-4 mr-2" />
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger value="inclusions" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300">
                      <Package className="w-4 h-4 mr-2" />
                      Inclusions
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300">
                      <FileText className="w-4 h-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300">
                      <Shield className="w-4 h-4 mr-2" />
                      Policies
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="itinerary" className="space-y-6 mt-6">
                    {/* Enhanced Flights */}
                    {pkg.flights && pkg.flights.length > 0 && (
                      <div className="animate-fade-in">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                          <Plane className="w-5 h-5 mr-2 text-[#01E8B2] animate-pulse" />
                          Flight Details
                        </h3>
                        <div className="space-y-3">
                          {pkg.flights.map((flight, index) => (
                            <Card key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#01E8B2] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-semibold text-gray-800">{flight.airline}</div>
                                    <div className="text-sm text-gray-600">
                                      {flight.departure} → {flight.arrival}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-[#964734]">
                                      {flight.departureTime} - {flight.arrivalTime}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Hotels */}
                    {pkg.hotels && pkg.hotels.length > 0 && (
                      <div className="animate-fade-in">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                          <Hotel className="w-5 h-5 mr-2 text-[#964734] animate-pulse" />
                          Accommodation
                        </h3>
                        <div className="space-y-3">
                          {pkg.hotels.map((hotel, index) => (
                            <Card key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-[#964734] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold text-gray-800">{hotel.name}</div>
                                    <div className="text-sm text-gray-600">{hotel.location}</div>
                                    <div className="flex items-center mt-1">
                                      {[...Array(hotel.starRating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-right text-sm text-[#964734]">
                                    <div>Check-in: {hotel.checkInTime}</div>
                                    <div>Check-out: {hotel.checkOutTime}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Sightseeing */}
                    {pkg.sightseeingList && pkg.sightseeingList.length > 0 && (
                      <div className="animate-fade-in">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                          <Camera className="w-5 h-5 mr-2 text-purple-500 animate-pulse" />
                          Sightseeing & Activities
                        </h3>
                        <div className="space-y-3">
                          {pkg.sightseeingList.map((sightseeing, index) => (
                            <Card key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold text-gray-800">{sightseeing.name}</div>
                                    <div className="text-sm text-gray-600">{sightseeing.location}</div>
                                    <div className="text-sm text-gray-700 mt-1">{sightseeing.description}</div>
                                  </div>
                                  <div className="text-sm text-purple-600 font-medium">
                                    Duration: {sightseeing.duration}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="inclusions" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="text-green-800 flex items-center">
                            <Package className="w-5 h-5 mr-2" />
                            What's Included
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-green-700 whitespace-pre-line leading-relaxed">{pkg.includeService}</div>
                        </CardContent>
                      </Card>

                      {pkg.excludeService && (
                        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <CardHeader>
                            <CardTitle className="text-red-800 flex items-center">
                              <Package className="w-5 h-5 mr-2" />
                              What's Not Included
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-red-700 whitespace-pre-line leading-relaxed">{pkg.excludeService}</div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {pkg.highlights && (
                      <Card className="bg-gradient-to-r from-[#01E8B2]/10 to-[#964734]/10 border-[#01E8B2]/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-800">
                            <Star className="w-5 h-5 mr-2 text-[#01E8B2]" />
                            Highlights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white/50 p-4 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">{pkg.highlights}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pkg.maxGroupSize && (
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-[#01E8B2]/20 rounded-lg">
                                <Users className="w-6 h-6 text-[#01E8B2]" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">Max Group Size</div>
                                <div className="text-gray-600">{pkg.maxGroupSize} people</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.minAge && (
                        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-[#964734]/20 rounded-lg">
                                <Calendar className="w-6 h-6 text-[#964734]" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">Minimum Age</div>
                                <div className="text-gray-600">{pkg.minAge} years</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.bestTimeToVisit && (
                        <Card className="bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Sun className="w-6 h-6 text-orange-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">Best Time to Visit</div>
                                <div className="text-gray-600">{pkg.bestTimeToVisit}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.weatherInfo && (
                        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Thermometer className="w-6 h-6 text-cyan-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">Weather Information</div>
                                <div className="text-gray-600">{pkg.weatherInfo}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {pkg.whatToBring && (
                      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-800">
                            <Luggage className="w-5 h-5 mr-2" />
                            What to Bring
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line leading-relaxed">{pkg.whatToBring}</div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="policies" className="space-y-6 mt-6">
                    {pkg.cancellationPolicy && (
                      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="flex items-center text-red-800">
                            <Shield className="w-5 h-5 mr-2" />
                            Cancellation Policy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line leading-relaxed">{pkg.cancellationPolicy}</div>
                        </CardContent>
                      </Card>
                    )}

                    {pkg.termsAndConditions && (
                      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-800">
                            <FileText className="w-5 h-5 mr-2" />
                            Terms & Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line leading-relaxed">{pkg.termsAndConditions}</div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Booking Card */}
            <Card className="sticky top-6 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-[#01E8B2] to-[#964734] p-1">
                <CardContent className="p-6 bg-white">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#964734] to-[#01E8B2] bg-clip-text text-transparent mb-2">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">per person</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-800">{pkg.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium text-gray-800">{pkg.destination}</span>
                    </div>
                    {pkg.maxGroupSize && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Group Size:</span>
                        <span className="font-medium text-gray-800">Up to {pkg.maxGroupSize}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-[#01E8B2] to-[#00d4a1] hover:from-[#00d4a1] hover:to-[#01E8B2] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleBookNow(pkg.packageId)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Book Now
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Secure booking with instant confirmation
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Enhanced Package Info */}
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Package className="w-5 h-5 mr-2" />
                  Package Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package ID:</span>
                  <span className="font-medium text-[#964734]">#{pkg.packageId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={`px-3 py-1 ${pkg.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {pkg.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {pkg.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-800">{new Date(pkg.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <LoginDialog onAuthSuccess={onAuthSuccess}>
          <div style={{ display: 'none' }} />
        </LoginDialog>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PackageDetails; 