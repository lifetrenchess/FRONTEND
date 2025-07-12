import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface AgentProfileProps {
  user: UserData | null;
}

const AgentProfile = ({ user }: AgentProfileProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Profile</h1>
        <p className="text-gray-600">Manage your agent profile and settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Agent profile functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentProfile; 