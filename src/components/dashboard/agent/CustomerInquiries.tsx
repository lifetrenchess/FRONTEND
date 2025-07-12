import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface CustomerInquiriesProps {
  user: UserData | null;
}

const CustomerInquiries = ({ user }: CustomerInquiriesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
        <p className="text-gray-600">Respond to customer questions and inquiries.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Customer inquiries functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInquiries; 