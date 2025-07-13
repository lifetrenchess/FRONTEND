import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, User, Mail, Phone, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';
import { searchUsers, updateUser, User as UserType } from '@/lib/userApi';
import PublicUserProfile from '@/components/user/PublicUserProfile';

interface Customer {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userContactNumber: string;
  userCreatedAt: string;
  userUpdatedAt: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showCustomerProfile, setShowCustomerProfile] = useState<number | null>(null);

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search
  useEffect(() => {
    let filtered = customers;
    
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Search for all customers (users with USER role)
      const searchResults = await searchUsers({ userRole: 'USER' });
      setCustomers(searchResults);
    } catch (error: any) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchUsers({ 
        userName: searchTerm,
        userRole: 'USER' // Only search for customers
      });
      setCustomers(searchResults);
    } catch (error: any) {
      toast.error('Search failed');
      console.error('Error searching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (userId: number, updates: Partial<Customer>) => {
    try {
      await updateUser(userId, updates);
      toast.success('Customer updated successfully!');
      setEditingCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer');
    }
  };

  const getCustomerStatus = (customer: Customer) => {
    // You can add logic here to determine customer status based on bookings, etc.
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading customers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your customer relationships and information</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchCustomers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex space-x-2">
        <Input
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => getCustomerStatus(c) === 'Active').length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-orange-600">
                {customers.filter(c => {
                  const createdAt = new Date(c.userCreatedAt);
                  const now = new Date();
                  return createdAt.getMonth() === now.getMonth() && 
                         createdAt.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <User className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#01E8B2] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.userName}</div>
                        <div className="text-sm text-gray-500">{customer.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.userContactNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-green-100 text-green-800">
                      {getCustomerStatus(customer)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.userCreatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCustomerProfile(customer.userId)}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        {showCustomerProfile === customer.userId && (
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Customer Profile</DialogTitle>
                            </DialogHeader>
                            <PublicUserProfile userId={customer.userId} showContact={true} />
                          </DialogContent>
                        )}
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        {editingCustomer && editingCustomer.userId === customer.userId && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Customer</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={editingCustomer.userName}
                                  onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, userName: e.target.value } : null)}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  value={editingCustomer.userEmail}
                                  onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, userEmail: e.target.value } : null)}
                                />
                              </div>
                              <div>
                                <Label>Contact Number</Label>
                                <Input
                                  value={editingCustomer.userContactNumber}
                                  onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, userContactNumber: e.target.value } : null)}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleUpdateCustomer(editingCustomer.userId, editingCustomer)}
                                  className="flex-1 bg-[#01E8B2] hover:bg-[#00d4a1]"
                                >
                                  Save Changes
                                </Button>
                                <Button 
                                  onClick={() => setEditingCustomer(null)} 
                                  variant="outline" 
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement; 