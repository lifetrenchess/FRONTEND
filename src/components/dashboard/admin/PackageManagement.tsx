import React from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const packages = [
  { name: 'Explore the Alps', destination: 'Swiss Alps', duration: '7 Days', price: 2500, status: 'Active' },
  { name: 'Coastal Bliss Getaway', destination: 'Maldives', duration: '5 Days', price: 3000, status: 'Active' },
  { name: 'City Lights Adventure', destination: 'Tokyo', duration: '10 Days', price: 4000, status: 'Active' },
  { name: 'Safari Expedition', destination: 'Serengeti', duration: '8 Days', price: 3500, status: 'Active' },
  { name: 'Island Paradise Retreat', destination: 'Fiji', duration: '6 Days', price: 2800, status: 'Active' },
  { name: 'Mountain Majesty Trek', destination: 'Himalayas', duration: '12 Days', price: 4500, status: 'Active' },
  { name: 'Cultural Heritage Tour', destination: 'Rome', duration: '7 Days', price: 2200, status: 'Active' },
  { name: 'Tropical Rainforest Escape', destination: 'Amazon', duration: '9 Days', price: 3800, status: 'Active' },
  { name: 'Desert Oasis Experience', destination: 'Sahara', duration: '5 Days', price: 2000, status: 'Active' },
  { name: 'Northern Lights Spectacle', destination: 'Iceland', duration: '4 Days', price: 2700, status: 'Active' },
];

const destinationOptions = [
  { label: 'Swiss Alps', value: 'Swiss Alps' },
  { label: 'Maldives', value: 'Maldives' },
  { label: 'Tokyo', value: 'Tokyo' },
  { label: 'Serengeti', value: 'Serengeti' },
  { label: 'Fiji', value: 'Fiji' },
  { label: 'Himalayas', value: 'Himalayas' },
  { label: 'Rome', value: 'Rome' },
  { label: 'Amazon', value: 'Amazon' },
  { label: 'Sahara', value: 'Sahara' },
  { label: 'Iceland', value: 'Iceland' },
];

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const columns = [
  { key: 'name', label: 'Package Name' },
  { key: 'destination', label: 'Destination' },
  { key: 'duration', label: 'Duration' },
  { key: 'price', label: 'Price', render: (row: any) => `$${row.price.toLocaleString()}` },
  { key: 'status', label: 'Status', render: (row: any) => <Badge variant="outline" className="capitalize">{row.status}</Badge> },
];

const filters = [
  { key: 'destination', label: 'Destination', options: destinationOptions },
  { key: 'status', label: 'Status', options: statusOptions },
];

const PackageManagement = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Manage Packages</h2>
    <TableWithSearchAndFilters
      columns={columns}
      data={packages}
      searchPlaceholder="Search packages"
      searchKeys={['name']}
      filters={filters}
      rowActions={(row) => <Button size="sm" variant="outline">Edit</Button>}
      pageSize={5}
    />
  </div>
);

export default PackageManagement; 