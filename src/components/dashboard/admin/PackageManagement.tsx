import React, { useEffect, useState } from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchAllPackages, deletePackage, updatePackageStatus, updatePackage, TravelPackageDto } from '@/lib/packagesApi';
import { toast } from 'sonner';
import { Edit, Trash2, Save, X } from 'lucide-react';

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const columns = [
  { key: 'title', label: 'Package Name' },
  { key: 'destination', label: 'Destination' },
  { key: 'duration', label: 'Duration', render: (row: any) => `${row.duration} Days` },
  { key: 'price', label: 'Price', render: (row: any) => `₹${row.price.toLocaleString()}` },
  { key: 'active', label: 'Status', render: (row: any) => <Badge variant="outline" className="capitalize">{row.active ? 'Active' : 'Inactive'}</Badge> },
];

const filters = [
  { key: 'destination', label: 'Destination', options: [] },
  { key: 'active', label: 'Status', options: statusOptions },
];

const PackageManagement = () => {
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<TravelPackageDto | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    destination: '',
    duration: '',
    price: '',
    includeService: '',
    excludeService: '',
    highlights: ''
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPackages();
      setPackages(data);
    } catch (err: any) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: TravelPackageDto) => {
    setEditingPackage(pkg);
    setEditForm({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination,
      duration: pkg.duration.toString(),
      price: pkg.price.toString(),
      includeService: pkg.includeService,
      excludeService: pkg.excludeService || '',
      highlights: pkg.highlights || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPackage) return;

    try {
      const updatedPackage = await updatePackage(editingPackage.packageId, {
        ...editingPackage,
        title: editForm.title,
        description: editForm.description,
        destination: editForm.destination,
        duration: parseInt(editForm.duration),
        price: parseFloat(editForm.price),
        includeService: editForm.includeService,
        excludeService: editForm.excludeService,
        highlights: editForm.highlights
      });

      setPackages(prev => prev.map(pkg => 
        pkg.packageId === editingPackage.packageId ? updatedPackage : pkg
      ));
      
      setEditingPackage(null);
      toast.success('Package updated successfully');
    } catch (err: any) {
      toast.error('Failed to update package');
    }
  };

  const handleCancelEdit = () => {
    setEditingPackage(null);
    setEditForm({
      title: '',
      description: '',
      destination: '',
      duration: '',
      price: '',
      includeService: '',
      excludeService: '',
      highlights: ''
    });
  };

  const handleDelete = async (packageId: number) => {
    try {
      await deletePackage(packageId);
      toast.success('Package deleted');
      loadPackages();
    } catch (err: any) {
      toast.error('Failed to delete package');
    }
  };

  const handleToggleStatus = async (pkg: TravelPackageDto) => {
    try {
      await updatePackageStatus(pkg.packageId, !pkg.active);
      toast.success('Package status updated');
      loadPackages();
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const rowActions = (row: TravelPackageDto) => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Package: {row.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Package Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter package title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter package description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={editForm.destination}
                  onChange={(e) => setEditForm(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="Enter destination"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Enter duration"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="includeService">Included Services</Label>
              <Textarea
                id="includeService"
                value={editForm.includeService}
                onChange={(e) => setEditForm(prev => ({ ...prev, includeService: e.target.value }))}
                placeholder="Enter included services"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="excludeService">Excluded Services</Label>
              <Textarea
                id="excludeService"
                value={editForm.excludeService}
                onChange={(e) => setEditForm(prev => ({ ...prev, excludeService: e.target.value }))}
                placeholder="Enter excluded services"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="highlights">Highlights</Label>
              <Textarea
                id="highlights"
                value={editForm.highlights}
                onChange={(e) => setEditForm(prev => ({ ...prev, highlights: e.target.value }))}
                placeholder="Enter package highlights"
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button 
        size="sm" 
        variant="outline" 
        className={row.active ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'} 
        onClick={() => handleToggleStatus(row)}
      >
        {row.active ? 'Deactivate' : 'Activate'}
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{row.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(row.packageId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Packages</h2>
      <TableWithSearchAndFilters
        columns={columns}
        data={packages}
        searchPlaceholder="Search packages"
        searchKeys={['title', 'destination']}
        filters={filters}
        rowActions={rowActions}
        pageSize={5}
        loading={loading}
      />
    </div>
  );
};

export default PackageManagement; 