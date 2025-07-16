import React, { useEffect, useState } from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAllPackages, deletePackage, updatePackageStatus, TravelPackageDto } from '@/lib/packagesApi';
import { toast } from 'sonner';

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
  { key: 'destination', label: 'Destination' },
  { key: 'active', label: 'Status', options: statusOptions },
];

const PackageManagement = () => {
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Button size="sm" variant="outline" onClick={() => toast.info('Edit not implemented in this demo')}>Edit</Button>
      <Button size="sm" variant="outline" className={row.active ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'} onClick={() => handleToggleStatus(row)}>
        {row.active ? 'Deactivate' : 'Activate'}
      </Button>
      <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleDelete(row.packageId)}>Delete</Button>
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