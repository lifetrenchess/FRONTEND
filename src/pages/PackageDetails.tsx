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
  Sun
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
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();
  const isBookingIntent = searchParams.get('booking') === 'true';

  useEffect(() => {
    if (!id) return;
    fetchPackageById(Number(id))
      .then((data) => {
        setPkg(data);
        setSelectedImage(data.mainImage || '');
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01E8B2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Package Not Found</h2>
        <Button onClick={() => navigate(-1)} className="bg-[#01E8B2] text-white">Go Back</Button>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center text-[#01E8B2] hover:underline">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Packages
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.duration} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#964734]">₹{pkg.price}</div>
                    <div className="text-gray-500 text-sm">per person</div>
                  </div>
                </div>

                {/* Package Type and Difficulty Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.packageType && (
                    <Badge className={getPackageTypeColor(pkg.packageType)}>
                      <Package className="w-3 h-3 mr-1" />
                      {pkg.packageType}
                    </Badge>
                  )}
                  {pkg.difficultyLevel && (
                    <Badge className={getDifficultyColor(pkg.difficultyLevel)}>
                      {pkg.difficultyLevel}
                    </Badge>
                  )}
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt={pkg.title} 
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${pkg.title} ${index + 1}`}
                            className={`w-full h-20 object-cover rounded cursor-pointer transition-opacity ${
                              selectedImage === image ? 'opacity-100 ring-2 ring-[#01E8B2]' : 'opacity-70 hover:opacity-100'
                            }`}
                            onClick={() => setSelectedImage(image)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Information Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="itinerary" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                  </TabsList>

                  <TabsContent value="itinerary" className="space-y-6">
                    {/* Flights */}
                    {pkg.flights && pkg.flights.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Plane className="w-5 h-5 mr-2 text-[#01E8B2]" />
                          Flight Details
                        </h3>
                        <div className="space-y-3">
                          {pkg.flights.map((flight, index) => (
                            <Card key={index} className="bg-gray-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-semibold">{flight.airline}</div>
                                    <div className="text-sm text-gray-600">
                                      {flight.departure} → {flight.arrival}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">
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

                    {/* Hotels */}
                    {pkg.hotels && pkg.hotels.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Hotel className="w-5 h-5 mr-2 text-[#01E8B2]" />
                          Accommodation
                        </h3>
                        <div className="space-y-3">
                          {pkg.hotels.map((hotel, index) => (
                            <Card key={index} className="bg-gray-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold">{hotel.name}</div>
                                    <div className="text-sm text-gray-600">{hotel.location}</div>
                                    <div className="flex items-center mt-1">
                                      {[...Array(hotel.starRating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-right text-sm">
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

                    {/* Sightseeing */}
                    {pkg.sightseeingList && pkg.sightseeingList.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Camera className="w-5 h-5 mr-2 text-[#01E8B2]" />
                          Sightseeing & Activities
                        </h3>
                        <div className="space-y-3">
                          {pkg.sightseeingList.map((sightseeing, index) => (
                            <Card key={index} className="bg-gray-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold">{sightseeing.name}</div>
                                    <div className="text-sm text-gray-600">{sightseeing.location}</div>
                                    <div className="text-sm text-gray-700 mt-1">{sightseeing.description}</div>
                                  </div>
                                  <div className="text-sm text-gray-600">
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

                  <TabsContent value="inclusions" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-green-800">What's Included</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-green-700 whitespace-pre-line">{pkg.includeService}</div>
                        </CardContent>
                      </Card>

                      {pkg.excludeService && (
                        <Card className="bg-red-50 border-red-200">
                          <CardHeader>
                            <CardTitle className="text-red-800">What's Not Included</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-red-700 whitespace-pre-line">{pkg.excludeService}</div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {pkg.highlights && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gradient-to-r from-[#01E8B2]/10 to-[#964734]/10 p-4 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">{pkg.highlights}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pkg.maxGroupSize && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-[#01E8B2]" />
                              <div>
                                <div className="font-semibold">Max Group Size</div>
                                <div className="text-gray-600">{pkg.maxGroupSize} people</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.minAge && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-[#01E8B2]" />
                              <div>
                                <div className="font-semibold">Minimum Age</div>
                                <div className="text-gray-600">{pkg.minAge} years</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.bestTimeToVisit && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Sun className="w-5 h-5 text-[#01E8B2]" />
                              <div>
                                <div className="font-semibold">Best Time to Visit</div>
                                <div className="text-gray-600">{pkg.bestTimeToVisit}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {pkg.weatherInfo && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-5 h-5 text-[#01E8B2]" />
                              <div>
                                <div className="font-semibold">Weather Information</div>
                                <div className="text-gray-600">{pkg.weatherInfo}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {pkg.whatToBring && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Luggage className="w-5 h-5 mr-2" />
                            What to Bring
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line">{pkg.whatToBring}</div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="policies" className="space-y-6">
                    {pkg.cancellationPolicy && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            Cancellation Policy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line">{pkg.cancellationPolicy}</div>
                        </CardContent>
                      </Card>
                    )}

                    {pkg.termsAndConditions && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Terms & Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-700 whitespace-pre-line">{pkg.termsAndConditions}</div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-[#964734] mb-2">₹{pkg.price}</div>
                  <div className="text-gray-500">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{pkg.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Destination:</span>
                    <span className="font-medium">{pkg.destination}</span>
                  </div>
                  {pkg.maxGroupSize && (
                    <div className="flex justify-between text-sm">
                      <span>Group Size:</span>
                      <span className="font-medium">Up to {pkg.maxGroupSize}</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-[#01E8B2] hover:bg-[#00d4a1] text-white py-3 text-lg font-semibold"
                  onClick={() => handleBookNow(pkg.packageId)}
                >
                  Book Now
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Secure booking with instant confirmation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Package Info */}
            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package ID:</span>
                  <span className="font-medium">#{pkg.packageId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={pkg.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {pkg.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {pkg.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(pkg.createdAt).toLocaleDateString()}</span>
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
    </div>
  );
};

export default PackageDetails; 