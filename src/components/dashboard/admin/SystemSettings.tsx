import React from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';

const payments = [
  { id: 'TXN12345', user: 'Sophia Clark', package: 'Paris Getaway', amount: 1500, method: 'Credit Card', date: '2024-07-26', status: 'Paid' },
  { id: 'TXN67890', user: 'Ethan Bennett', package: 'Tokyo Adventure', amount: 2200, method: 'PayPal', date: '2024-07-25', status: 'Paid' },
  { id: 'TXN24680', user: 'Olivia Carter', package: 'London Escape', amount: 1800, method: 'Credit Card', date: '2024-07-24', status: 'Paid' },
  { id: 'TXN13579', user: 'Liam Davis', package: 'Rome Romance', amount: 1200, method: 'Credit Card', date: '2024-07-23', status: 'Failed' },
  { id: 'TXN98765', user: 'Ava Evans', package: 'Barcelona Bliss', amount: 1900, method: 'PayPal', date: '2024-07-22', status: 'Paid' },
  { id: 'TXN54321', user: 'Noah Foster', package: 'Sydney Sojourn', amount: 2500, method: 'Credit Card', date: '2024-07-21', status: 'Paid' },
  { id: 'TXN11223', user: 'Isabella Green', package: 'New York City Trip', amount: 2000, method: 'Credit Card', date: '2024-07-20', status: 'Refunded' },
  { id: 'TXN33445', user: 'Jackson Hayes', package: 'Bail Retreat', amount: 1700, method: 'PayPal', date: '2024-07-19', status: 'Paid' },
  { id: 'TXN55667', user: 'Mia Ingram', package: 'Santorini Serenity', amount: 2100, method: 'Credit Card', date: '2024-07-18', status: 'Paid' },
  { id: 'TXN77889', user: 'Lucas Jenkins', package: 'Machu Picchu Trek', amount: 1600, method: 'Credit Card', date: '2024-07-17', status: 'Paid' },
];

const methodOptions = [
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'PayPal', value: 'PayPal' },
];

const statusOptions = [
  { label: 'Paid', value: 'Paid' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Refunded', value: 'Refunded' },
];

const columns = [
  { key: 'id', label: 'Transaction ID' },
  { key: 'user', label: 'User' },
  { key: 'package', label: 'Package Name' },
  { key: 'amount', label: 'Amount', render: (row: any) => `$${row.amount.toLocaleString()}` },
  { key: 'method', label: 'Payment Method' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', render: (row: any) => {
    let color = 'outline';
    if (row.status === 'Paid') color = 'success';
    if (row.status === 'Failed') color = 'destructive';
    if (row.status === 'Refunded') color = 'secondary';
    return <Badge variant={color as any} className="capitalize">{row.status}</Badge>;
  } },
];

const filters = [
  { key: 'method', label: 'Payment Method', options: methodOptions },
  { key: 'status', label: 'Status', options: statusOptions },
];

const Payments = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Payments</h2>
    <TableWithSearchAndFilters
      columns={columns}
      data={payments}
      searchPlaceholder="Search by Transaction ID, User, or Package Name"
      searchKeys={['id', 'user', 'package']}
      filters={filters}
      pageSize={5}
    />
  </div>
);

export default Payments; 