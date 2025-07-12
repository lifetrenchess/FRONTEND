import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, Filter, RefreshCw, MapPin, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface Package {
  packageId: number;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  includedServices: string;
  status: string;
  availableSeats?: number;
}

const PackageManagement = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
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
    includedServices: '',
    availableSeats: ''
  });

  // Load all packages
  const loadPackages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('PACKAGE_SERVICE', '/packages'));
      
      if (!response.ok) {
        throw new Error('Failed to load packages');
      }
      
      const data: Package[] = await response.json();
      setPackages(data);
      setFilteredPackages(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load packages');
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
    loadPackages();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.destination || !formData.duration || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const packageData = {
      title: formData.title,
      description: formData.description,
      destination: formData.destination,
      duration: formData.duration,
      price: parseFloat(formData.price),
      includedServices: formData.includedServices,
      availableSeats: formData.availableSeats ? parseInt(formData.availableSeats) : null,
      status: 'Active'
    };

    try {
      const url = editingPackage 
        ? getApiUrl('PACKAGE_SERVICE', `/packages/${editingPackage.packageId}`)
        : getApiUrl('PACKAGE_SERVICE', '/packages');
      
      const method = editingPackage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        throw new Error('Failed to save package');
      }

      const savedPackage: Package = await response.json();
      
      if (editingPackage) {
        setPackages(prev => 
          prev.map(pkg => 
            pkg.packageId === savedPackage.packageId ? savedPackage : pkg
          )
        );
        toast.success('Package updated successfully!');
      } else {
        setPackages(prev => [...prev, savedPackage]);
        toast.success('Package created successfully!');
      }
      
      resetForm();
    } catch (err: any) {
      toast.error(`Failed to save package: ${err.message}`);
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
      includedServices: '',
      availableSeats: ''
    });
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
      duration: pkg.duration,
      price: pkg.price.toString(),
      includedServices: pkg.includedServices,
      availableSeats: pkg.availableSeats?.toString() || ''
    });
    setIsCreating(true);
  };

  // Delete package
  const handleDelete = async (packageId: number) => {
    try {
      const response = await fetch(getApiUrl('PACKAGE_SERVICE', `/packages/${packageId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete package');
      }

      setPackages(prev => prev.filter(pkg => pkg.packageId !== packageId));
      toast.success('Package deleted successfully!');
    } catch (err: any) {
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
          <Button onClick={loadPackages} variant="outline">
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
          <p className="text-gray-600">Create and manage travel packages</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadPackages} variant="outline" size="sm">
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
          <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {editingPackage ? 'Update package details below.' : 'Fill in the package details below.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Package Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Explore the Alps"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g., Swiss Alps"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 7 Days"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., 2500"
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
                  placeholder="Describe the package details..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="includedServices">Included Services</Label>
                <Textarea
                  id="includedServices"
                  value={formData.includedServices}
                  onChange={(e) => setFormData(prev => ({ ...prev, includedServices: e.target.value }))}
                  placeholder="e.g., Flights, Hotel, Meals, Transportation"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Input
                  id="availableSeats"
                  type="number"
                  value={formData.availableSeats}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableSeats: e.target.value }))}
                  placeholder="e.g., 20"
                />
              </div>
            </form>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={resetForm}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} className="bg-palette-orange hover:bg-palette-orange/90">
                {editingPackage ? 'Update Package' : 'Create Package'}
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
                        </div>
                        
                        <p className="text-gray-700 mb-2">{pkg.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-medium text-green-600">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            ${pkg.price.toLocaleString()}
                          </span>
                          {pkg.availableSeats && (
                            <span>Available Seats: {pkg.availableSeats}</span>
                          )}
                        </div>
                        
                        {pkg.includedServices && (
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>Includes:</strong> {pkg.includedServices}
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