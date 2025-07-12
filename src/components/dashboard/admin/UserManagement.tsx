import React from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';

const users = [
  { name: 'Sophia Carter', email: 'sophia.carter@email.com', role: 'User', registrationDate: '2023-01-15', bookings: 5 },
  { name: 'Ethan Bennett', email: 'ethan.bennett@email.com', role: 'Agent', registrationDate: '2022-11-20', bookings: 12 },
  { name: 'Olivia Hayes', email: 'olivia.hayes@email.com', role: 'User', registrationDate: '2023-03-08', bookings: 2 },
  { name: 'Liam Foster', email: 'liam.foster@email.com', role: 'User', registrationDate: '2023-02-28', bookings: 8 },
  { name: 'Ava Morgan', email: 'ava.morgan@email.com', role: 'Admin', registrationDate: '2022-10-10', bookings: 0 },
  { name: 'Noah Parker', email: 'noah.parker@email.com', role: 'User', registrationDate: '2023-04-12', bookings: 3 },
  { name: 'Isabella Reed', email: 'isabella.reed@email.com', role: 'Agent', registrationDate: '2023-01-22', bookings: 15 },
  { name: 'Jackson Cole', email: 'jackson.cole@email.com', role: 'User', registrationDate: '2023-03-15', bookings: 6 },
  { name: 'Mia Hughes', email: 'mia.hughes@email.com', role: 'User', registrationDate: '2023-02-05', bookings: 4 },
  { name: 'Lucas Gray', email: 'lucas.gray@email.com', role: 'Agent', registrationDate: '2022-12-01', bookings: 10 },
];

const roleOptions = [
  { label: 'User', value: 'User' },
  { label: 'Agent', value: 'Agent' },
  { label: 'Admin', value: 'Admin' },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', render: (row: any) => <Badge variant="outline" className="capitalize">{row.role}</Badge> },
  { key: 'registrationDate', label: 'Registration Date' },
  { key: 'bookings', label: 'Number of Bookings' },
];

const filters = [
  { key: 'role', label: 'Role', options: roleOptions },
];

const UserManagement = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
    <TableWithSearchAndFilters
      columns={columns}
      data={users}
      searchPlaceholder="Search users by name or email"
      searchKeys={['name', 'email']}
      filters={filters}
      pageSize={5}
    />
  </div>
);

export default UserManagement; 