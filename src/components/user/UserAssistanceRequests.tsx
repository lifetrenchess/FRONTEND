import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Clock, CheckCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface AssistanceDTO {
  requestId?: number;
  userId: number;
  issueDescription: string;
  status?: string;
  resolutionTime?: string;
  resolutionMessage?: string;
}

interface UserAssistanceRequestsProps {
  userId: number;
  onNewRequest?: () => void;
}

const UserAssistanceRequests: React.FC<UserAssistanceRequestsProps> = ({ 
  userId, 
  onNewRequest 
}) => {
  const [requests, setRequests] = useState<AssistanceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Load user's assistance requests
  const loadUserRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/user/${userId}`));
      
      if (!response.ok) {
        throw new Error('Failed to load your assistance requests');
      }
      
      const data: AssistanceDTO[] = await response.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load your assistance requests');
    } finally {
      setLoading(false);
    }
  };

  // Load requests on component mount
  useEffect(() => {
    loadUserRequests();
  }, [userId]);

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'Resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading your requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadUserRequests} variant="outline">
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
          <h3 className="text-xl font-semibold text-gray-900">My Assistance Requests</h3>
          <p className="text-gray-600">Track your support requests and responses</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadUserRequests} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {onNewRequest && (
            <Button onClick={onNewRequest} size="sm" className="bg-palette-orange hover:bg-palette-orange/90">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {requests.filter(r => r.status === 'Pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'Resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">You haven't submitted any assistance requests yet.</p>
              {onNewRequest && (
                <Button onClick={onNewRequest} className="bg-palette-orange hover:bg-palette-orange/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your First Request
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.requestId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">
                            Request #{request.requestId}
                          </span>
                          {getStatusBadge(request.status || 'Unknown')}
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-gray-700">{request.issueDescription}</p>
                        </div>

                        {request.status === 'Resolved' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Admin Response</p>
                                <p className="text-sm text-green-700">{request.resolutionMessage}</p>
                                <p className="text-xs text-green-600 mt-1">
                                  Resolved: {request.resolutionTime ? formatDate(request.resolutionTime) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
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

export default UserAssistanceRequests; 