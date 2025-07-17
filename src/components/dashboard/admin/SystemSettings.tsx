import React, { useState, useEffect } from 'react';
import TableWithSearchAndFilters from './TableWithSearchAndFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllBookings, BookingResponse } from '@/lib/bookingApi';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { getAllUsers } from '@/lib/userApi';
import { RefreshCw, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentData {
  id: string;
  user: string;
  package: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  bookingId: number;
  userId: number;
}

const SystemSettings = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchPaymentData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [bookings, packages, users] = await Promise.all([
        getAllBookings(),
        fetchAllPackages(),
        getAllUsers()
      ]);

      // Transform booking data into payment data
      const paymentData: PaymentData[] = bookings
        .filter(booking => booking.status === 'PAID' || booking.status === 'CONFIRMED')
        .map(booking => {
          const packageData = packages.find(p => p.packageId === booking.packageId);
          const userData = users.find(u => u.userId === booking.userId);
          
          return {
            id: `TXN${booking.bookingId.toString().padStart(5, '0')}`,
            user: userData?.userName || `User ${booking.userId}`,
            package: packageData?.title || 'Unknown Package',
            amount: packageData?.price || 0,
            method: 'Credit Card', // Default since we don't have payment method in booking
            date: new Date(booking.createdAt || booking.startDate).toLocaleDateString(),
            status: booking.status === 'PAID' ? 'Paid' : 'Confirmed',
            bookingId: booking.bookingId,
            userId: booking.userId
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPayments(paymentData);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const methodOptions = [
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Debit Card', value: 'Debit Card' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Net Banking', value: 'Net Banking' },
  ];

  const statusOptions = [
    { label: 'Paid', value: 'Paid' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' },
  ];

  const columns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'user', label: 'User' },
    { key: 'package', label: 'Package Name' },
    { key: 'amount', label: 'Amount', render: (row: any) => `₹${row.amount.toLocaleString()}` },
    { key: 'method', label: 'Payment Method' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (row: any) => {
      let color = 'outline';
      if (row.status === 'Paid') color = 'success';
      if (row.status === 'Confirmed') color = 'default';
      if (row.status === 'Pending') color = 'secondary';
      if (row.status === 'Failed') color = 'destructive';
      return <Badge variant={color as any} className="capitalize">{row.status}</Badge>;
    } },
  ];

  const filters = [
    { key: 'method', label: 'Payment Method', options: methodOptions },
    { key: 'status', label: 'Status', options: statusOptions },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Payment Management</h2>
          <p className="text-gray-600">Monitor all payment transactions and financial data</p>
        </div>
        <Button onClick={fetchPaymentData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Transactions</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'Paid').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Transaction</p>
              <p className="text-2xl font-bold">
                ₹{payments.length > 0 ? (payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Transactions</h3>
        <TableWithSearchAndFilters
          columns={columns}
          data={payments}
          searchPlaceholder="Search by Transaction ID, User, or Package Name"
          searchKeys={['id', 'user', 'package']}
          filters={filters}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default SystemSettings; 