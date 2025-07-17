import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, Filter, RefreshCw, MapPin, Calendar, DollarSign, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface Package {
  packageId: number;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  includeService: string;
  excludeService?: string;
  highlights?: string;
  status: string;
  mainImage?: string;
  images?: string[];
  active?: boolean;
  createdByAgentId?: number;
  createdAt?: string;
  updatedAt?: string;
  flights?: Flight[];
  hotels?: Hotel[];
  sightseeingList?: Sightseeing[];
}

interface Flight {
  flightId?: number;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
}

interface Hotel {
  hotelId?: number;
  name: string;
  location: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
}

interface Sightseeing {
  sightseeingId?: number;
  placeName: string;
  description: string;
  time: string;
}

const PackageManagement = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Get current user to get agent ID
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const agentId = currentUser.userId || 1;
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: '',
    price: '',
    includeService: '',
    excludeService: '',
    highlights: '',
    active: true
  });

  // Flight states
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [flightForm, setFlightForm] = useState({
    airline: '',
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: ''
  });

  // Hotel states
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    starRating: 3,
    checkInTime: '14:00',
    checkOutTime: '12:00'
  });

  // Sightseeing states
  const [sightseeingList, setSightseeingList] = useState<Sightseeing[]>([]);
  const [showSightseeingForm, setShowSightseeingForm] = useState(false);
  const [sightseeingForm, setSightseeingForm] = useState({
    placeName: '',
    description: '',
    time: ''
  });

  // Image upload states
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch ALL packages from the database - agents can manage all packages
      const response = await fetch(getApiUrl('PACKAGE_SERVICE', ''), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const allPackages = await response.json();
        setPackages(allPackages);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch packages: ${errorText}`);
        console.error('Failed to fetch packages:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to fetch packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter packages
  useEffect(() => {
    let filtered = packages;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter);
    }
    
    // Filter by destination
    if (destinationFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.destination === destinationFilter);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(term) ||
        pkg.description.toLowerCase().includes(term) ||
        pkg.destination.toLowerCase().includes(term)
      );
    }
    
    setFilteredPackages(filtered);
  }, [packages, statusFilter, destinationFilter, searchTerm]);

  // Load packages on component mount
  useEffect(() => {
    fetchPackages();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchPackages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setMainImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Please select files under 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + additionalImages.length > 5) {
      toast.error('Maximum 5 additional images allowed');
      return;
    }

    setAdditionalImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdditionalImagesPreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Clear main image
  const clearMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.destination || !formData.duration || !formData.price || !formData.includeService) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    
    try {
      // Add package data as JSON string
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const agentId = currentUser.userId || 1;
      
      const packageData = {
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        includeService: formData.includeService,
        excludeService: formData.excludeService || '',
        highlights: formData.highlights || '',
        active: formData.active,
        createdByAgentId: agentId, // Set current agent as creator for new packages
        flights: flights,
        hotels: hotels,
        sightseeingList: sightseeingList
      };

      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();
      
      // Add package data as JSON string
      formDataToSend.append('packageData', JSON.stringify(packageData));
      
      // Add main image if selected
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage);
      }
      
      // Add additional images if selected
      if (additionalImages.length > 0) {
        additionalImages.forEach((image, index) => {
          formDataToSend.append('additionalImages', image);
        });
      }

      const response = await fetch(`${getApiUrl('PACKAGE_SERVICE', '')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend // Send as FormData, not JSON
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(editingPackage 
          ? "Package updated successfully!" 
          : "Package created successfully!");
        
        // Refresh the packages list
        await fetchPackages();
        
        // Reset form
        resetForm();
      } else {
        const errorData = await response.text();
        toast.error(`Failed to ${editingPackage ? 'update' : 'create'} package: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${editingPackage ? 'update' : 'create'} package. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      destination: '',
      duration: '',
      price: '',
      includeService: '',
      excludeService: '',
      highlights: '',
      active: true
    });
    setFlights([]);
    setHotels([]);
    setSightseeingList([]);
    setMainImage(null);
    setMainImagePreview('');
    setAdditionalImages([]);
    setAdditionalImagesPreview([]);
    setEditingPackage(null);
    setIsCreating(false);
  };

  // Edit package
  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination,
      duration: pkg.duration.toString(),
      price: pkg.price.toString(),
      includeService: pkg.includeService,
      excludeService: pkg.excludeService || '',
      highlights: pkg.highlights || '',
      active: pkg.active || true
    });
    
    // Set existing flights, hotels, and sightseeing
    setFlights(pkg.flights || []);
    setHotels(pkg.hotels || []);
    setSightseeingList(pkg.sightseeingList || []);
    
    // Set existing images
    if (pkg.mainImage) {
      setMainImagePreview(pkg.mainImage);
    }
    
    if (pkg.images && Array.isArray(pkg.images)) {
      setAdditionalImagesPreview(pkg.images);
    }
    
    setIsCreating(true);
  };

  // Delete package
  const handleDelete = async (packageId: number) => {
    try {
      console.log('Attempting to delete package:', packageId);
      const url = getApiUrl('PACKAGE_SERVICE', `/${packageId}`);
      console.log('Delete URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to delete package: ${response.status} - ${errorText}`);
      }

      console.log('Package deleted successfully');
      setPackages(prev => prev.filter(pkg => pkg.packageId !== packageId));
      toast.success('Package deleted successfully!');
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(`Failed to delete package: ${err.message}`);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Draft': 'bg-yellow-100 text-yellow-800'
    };
    return <Badge variant="secondary" className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading packages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPackages} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Package Management</h2>
          <p className="text-gray-600">Manage all travel packages in the system. You can edit any package and create new ones.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchPackages} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreating(true)} size="sm" className="bg-palette-orange hover:bg-palette-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold">{packages.length}</p>
                <p className="text-xs text-gray-500">
                  {packages.filter(p => p.createdByAgentId === agentId).length} created by you
                </p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {packages.filter(p => p.status === 'Active').length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${packages.length > 0 ? (packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toFixed(0) : '0'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Destinations</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(packages.map(p => p.destination)).size}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="destination-filter">Destination</Label>
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {Array.from(new Set(packages.map(p => p.destination))).map(dest => (
                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Package Modal */}
      {isCreating && (
        <AlertDialog open={isCreating} onOpenChange={setIsCreating}>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {editingPackage ? 'Edit Travel Package' : 'Create New Travel Package'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the package details. Fields marked with * are required.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Package Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Package Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Paris Adventure"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (Days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 7"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., 2500.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the travel package in detail..."
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="includeService">Included Services *</Label>
                <Textarea
                  id="includeService"
                  value={formData.includeService}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeService: e.target.value }))}
                  placeholder="e.g., Flights, Hotel, Meals, Transportation"
                  rows={2}
                  required
                />
              </div>

              {/* Optional Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Optional Information</h3>
                
                {/* Services and Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="excludeService">Excluded Services (Optional)</Label>
                    <Textarea
                      id="excludeService"
                      value={formData.excludeService}
                      onChange={(e) => setFormData(prev => ({ ...prev, excludeService: e.target.value }))}
                      placeholder="e.g., Lunch, Personal Expenses, Optional Tours"
                      rows={2}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="highlights">Highlights (Optional)</Label>
                    <Textarea
                      id="highlights"
                      value={formData.highlights}
                      onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
                      placeholder="e.g., Eiffel Tower, Louvre Museum, Seine River Cruise"
                      rows={2}
                    />
                  </div>
                </div>

              {/* Flights Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Flights</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFlightForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flight
                  </Button>
                </div>
                
                {flights.length > 0 && (
                  <div className="space-y-2">
                    {flights.map((flight, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{flight.airline}</p>
                          <p className="text-sm text-gray-600">
                            {flight.departure} → {flight.arrival}
                          </p>
                          <p className="text-sm text-gray-500">
                            {flight.departureTime} - {flight.arrivalTime}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFlights(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hotels Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Hotels</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHotelForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hotel
                  </Button>
                </div>
                
                {hotels.length > 0 && (
                  <div className="space-y-2">
                    {hotels.map((hotel, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-sm text-gray-600">{hotel.location}</p>
                          <p className="text-sm text-gray-500">
                            {hotel.starRating}★ • Check-in: {hotel.checkInTime} • Check-out: {hotel.checkOutTime}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setHotels(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sightseeing Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sightseeing</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSightseeingForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sightseeing
                  </Button>
                </div>
                
                {sightseeingList.length > 0 && (
                  <div className="space-y-2">
                    {sightseeingList.map((sightseeing, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{sightseeing.placeName}</p>
                          <p className="text-sm text-gray-600">{sightseeing.description}</p>
                          <p className="text-sm text-gray-500">Time: {sightseeing.time}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSightseeingList(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Image Upload Section (Optional) */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Package Images (Optional)</h4>
                
                {/* Main Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="mainImage">Main Image</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        id="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a main image for the package (Max 5MB)</p>
                    </div>
                    {mainImagePreview && (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="Main image preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearMainImage}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Images Upload */}
                <div className="space-y-2">
                  <Label htmlFor="additionalImages">Additional Images</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        id="additionalImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload up to 5 additional images (Max 5MB each)</p>
                    </div>
                  </div>
                  
                  {/* Additional Images Preview */}
                  {additionalImagesPreview.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {additionalImagesPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </form>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={resetForm}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSubmit} 
                className="bg-palette-orange hover:bg-palette-orange/90"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {editingPackage ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Flight Form Dialog */}
      {showFlightForm && (
        <AlertDialog open={showFlightForm} onOpenChange={setShowFlightForm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Flight</AlertDialogTitle>
              <AlertDialogDescription>
                Add flight details for this travel package.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={flightForm.airline}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, airline: e.target.value }))}
                  placeholder="e.g., Air France"
                />
              </div>
              
              <div>
                <Label htmlFor="departure">Departure Airport</Label>
                <Input
                  id="departure"
                  value={flightForm.departure}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, departure: e.target.value }))}
                  placeholder="e.g., CDG"
                />
              </div>
              
              <div>
                <Label htmlFor="arrival">Arrival Airport</Label>
                <Input
                  id="arrival"
                  value={flightForm.arrival}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, arrival: e.target.value }))}
                  placeholder="e.g., JFK"
                />
              </div>
              
              <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  type="datetime-local"
                  value={flightForm.departureTime}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, departureTime: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="datetime-local"
                  value={flightForm.arrivalTime}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowFlightForm(false);
                setFlightForm({
                  airline: '',
                  departure: '',
                  arrival: '',
                  departureTime: '',
                  arrivalTime: ''
                });
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setFlights(prev => [...prev, flightForm]);
                setShowFlightForm(false);
                setFlightForm({
                  airline: '',
                  departure: '',
                  arrival: '',
                  departureTime: '',
                  arrivalTime: ''
                });
              }}>
                Add Flight
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Hotel Form Dialog */}
      {showHotelForm && (
        <AlertDialog open={showHotelForm} onOpenChange={setShowHotelForm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Hotel</AlertDialogTitle>
              <AlertDialogDescription>
                Add hotel details for this travel package.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Hotel Le Meurice"
                />
              </div>
              
              <div>
                <Label htmlFor="hotelLocation">Location</Label>
                <Input
                  id="hotelLocation"
                  value={hotelForm.location}
                  onChange={(e) => setHotelForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Paris"
                />
              </div>
              
              <div>
                <Label htmlFor="starRating">Star Rating</Label>
                <Select value={hotelForm.starRating.toString()} onValueChange={(value) => setHotelForm(prev => ({ ...prev, starRating: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={hotelForm.checkInTime}
                  onChange={(e) => setHotelForm(prev => ({ ...prev, checkInTime: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={hotelForm.checkOutTime}
                  onChange={(e) => setHotelForm(prev => ({ ...prev, checkOutTime: e.target.value }))}
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowHotelForm(false);
                setHotelForm({
                  name: '',
                  location: '',
                  starRating: 3,
                  checkInTime: '14:00',
                  checkOutTime: '12:00'
                });
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setHotels(prev => [...prev, hotelForm]);
                setShowHotelForm(false);
                setHotelForm({
                  name: '',
                  location: '',
                  starRating: 3,
                  checkInTime: '14:00',
                  checkOutTime: '12:00'
                });
              }}>
                Add Hotel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Sightseeing Form Dialog */}
      {showSightseeingForm && (
        <AlertDialog open={showSightseeingForm} onOpenChange={setShowSightseeingForm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Sightseeing</AlertDialogTitle>
              <AlertDialogDescription>
                Add sightseeing details for this travel package.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="placeName">Place Name</Label>
                <Input
                  id="placeName"
                  value={sightseeingForm.placeName}
                  onChange={(e) => setSightseeingForm(prev => ({ ...prev, placeName: e.target.value }))}
                  placeholder="e.g., Eiffel Tower"
                />
              </div>
              
              <div>
                <Label htmlFor="sightseeingDescription">Description</Label>
                <Textarea
                  id="sightseeingDescription"
                  value={sightseeingForm.description}
                  onChange={(e) => setSightseeingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Visit the iconic Eiffel Tower"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="sightseeingTime">Time</Label>
                <Input
                  id="sightseeingTime"
                  type="datetime-local"
                  value={sightseeingForm.time}
                  onChange={(e) => setSightseeingForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowSightseeingForm(false);
                setSightseeingForm({
                  placeName: '',
                  description: '',
                  time: ''
                });
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setSightseeingList(prev => [...prev, sightseeingForm]);
                setShowSightseeingForm(false);
                setSightseeingForm({
                  placeName: '',
                  description: '',
                  time: ''
                });
              }}>
                Add Sightseeing
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Packages List */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Packages ({filteredPackages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPackages.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No packages found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.packageId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">{pkg.title}</span>
                          {getStatusBadge(pkg.status)}
                          <span className="text-sm text-gray-500">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {pkg.destination}
                          </span>
                          <span className="text-sm text-gray-500">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {pkg.duration}
                          </span>
                          {/* Show if package was created by current agent */}
                          {pkg.createdByAgentId === agentId && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              My Package
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{pkg.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-medium text-green-600">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            ${pkg.price.toLocaleString()}
                          </span>
                          {pkg.mainImage && (
                            <span className="flex items-center text-blue-600">
                              <ImageIcon className="w-4 h-4 mr-1" />
                              Has Images
                            </span>
                          )}
                        </div>
                        
                        {pkg.includeService && (
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>Includes:</strong> {pkg.includeService}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Package</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{pkg.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(pkg.packageId)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManagement; 