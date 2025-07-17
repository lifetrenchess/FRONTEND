import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Search, Filter, RefreshCw } from 'lucide-react';
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

const AssistanceManagement = () => {
  const [requests, setRequests] = useState<AssistanceDTO[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AssistanceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Resolution states
  const [selectedRequest, setSelectedRequest] = useState<AssistanceDTO | null>(null);
  const [resolutionMessage, setResolutionMessage] = useState<string>('');
  const [resolving, setResolving] = useState(false);

  // Load all assistance requests
  const loadRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', ''));
      
      if (!response.ok) {
        throw new Error('Failed to load assistance requests');
      }
      
      const data: AssistanceDTO[] = await response.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load assistance requests');
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on status and search term
  useEffect(() => {
    let filtered = requests;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Filter by search term (user ID or issue description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.userId.toString().includes(term) ||
        request.issueDescription.toLowerCase().includes(term) ||
        (request.requestId && request.requestId.toString().includes(term))
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchTerm]);

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle request resolution
  const handleResolveRequest = async () => {
    if (!selectedRequest || !resolutionMessage.trim()) {
      toast.error('Please enter a resolution message');
      return;
    }

    setResolving(true);

    try {
      const response = await fetch(
        getApiUrl('ASSISTANCE_SERVICE', `/${selectedRequest.requestId}/resolve`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resolutionMessage),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to resolve request');
      }

      toast.success('Request resolved successfully!');
      setResolutionMessage('');
      setSelectedRequest(null);
      loadRequests(); // Refresh the list
    } catch (err: any) {
      toast.error(`Failed to resolve request: ${err.message}`);
    } finally {
      setResolving(false);
    }
  };

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
          <span>Loading assistance requests...</span>
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
          <Button onClick={loadRequests} variant="outline">
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
          <h2 className="text-2xl font-bold text-gray-900">Assistance Management</h2>
          <p className="text-gray-600">Manage customer support requests and provide resolutions</p>
        </div>
        <Button onClick={loadRequests} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by User ID, Request ID, or issue description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Assistance Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assistance requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.requestId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">
                            Request #{request.requestId}
                          </span>
                          {getStatusBadge(request.status || 'Unknown')}
                          <span className="text-sm text-gray-500">
                            User ID: {request.userId}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-gray-700">{request.issueDescription}</p>
                        </div>

                        {request.status === 'Resolved' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Resolution</p>
                                <p className="text-sm text-green-700">{request.resolutionMessage}</p>
                                <p className="text-xs text-green-600 mt-1">
                                  Resolved: {request.resolutionTime ? formatDate(request.resolutionTime) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.status === 'Pending' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-palette-teal hover:bg-palette-teal/90">
                              Resolve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Resolve Assistance Request</AlertDialogTitle>
                              <AlertDialogDescription>
                                Provide a resolution message for Request #{request.requestId} from User {request.userId}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">User Issue:</p>
                                <p className="text-sm text-gray-600">{request.issueDescription}</p>
                              </div>
                              
                              <div>
                                <Label htmlFor="resolution-message">Resolution Message</Label>
                                <Textarea
                                  id="resolution-message"
                                  placeholder="Enter your resolution message..."
                                  value={resolutionMessage}
                                  onChange={(e) => setResolutionMessage(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel 
                                onClick={() => {
                                  setSelectedRequest(null);
                                  setResolutionMessage('');
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => {
                                  setSelectedRequest(request);
                                  handleResolveRequest();
                                }}
                                disabled={resolving || !resolutionMessage.trim()}
                                className="bg-palette-teal hover:bg-palette-teal/90"
                              >
                                {resolving ? 'Resolving...' : 'Resolve Request'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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

export default AssistanceManagement; 