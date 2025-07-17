import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Star, MessageSquare, Search, Filter, RefreshCw, Reply, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface Review {
  reviewID: number;
  userId: number;
  packageId: number;
  rating: number;
  comment: string;
  agentResponse?: string;
  timestamp?: string;
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filter states
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [responseFilter, setResponseFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Response states
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [responding, setResponding] = useState(false);

  // Load all reviews
  const loadReviews = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', ''));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to load reviews');
      }
      
      const data: Review[] = await response.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reviews';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews based on rating, response status, and search term
  useEffect(() => {
    let filtered = reviews;
    
    // Filter by rating
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }
    
    // Filter by response status
    if (responseFilter !== 'all') {
      if (responseFilter === 'responded') {
        filtered = filtered.filter(review => review.agentResponse && review.agentResponse.trim() !== '');
      } else if (responseFilter === 'not-responded') {
        filtered = filtered.filter(review => !review.agentResponse || review.agentResponse.trim() === '');
      }
    }
    
    // Filter by search term (comment content)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.comment.toLowerCase().includes(term) ||
        (review.agentResponse && review.agentResponse.toLowerCase().includes(term)) ||
        review.reviewID.toString().includes(term) ||
        review.userId.toString().includes(term)
      );
    }
    
    setFilteredReviews(filtered);
  }, [reviews, ratingFilter, responseFilter, searchTerm]);

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, []);

  // Handle agent response submission
  const handleRespond = async () => {
    if (!selectedReview || !agentResponse.trim()) {
      toast.error('Please provide a response message');
      return;
    }

    setResponding(true);
    
    try {
      const response = await fetch(
        getApiUrl('REVIEW_SERVICE', `/${selectedReview.reviewID}/response`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentResponse: agentResponse.trim()
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit response');
      }

      const updatedReview: Review = await response.json();
      
      // Update the reviews list
      setReviews(prev => 
        prev.map(review => 
          review.reviewID === updatedReview.reviewID ? updatedReview : review
        )
      );
      
      setSelectedReview(null);
      setAgentResponse('');
      toast.success('Response submitted successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit response';
      toast.error(errorMessage);
    } finally {
      setResponding(false);
    }
  };

  // Render stars
  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get rating badge color
  const getRatingBadge = (rating: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800'
    };
    return <Badge variant="secondary" className={colors[rating as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{rating} Star{rating !== 1 ? 's' : ''}</Badge>;
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
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadReviews} variant="outline">
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
          <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
          <p className="text-gray-600">Respond to customer reviews and manage feedback</p>
        </div>
        <Button onClick={loadReviews} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.agentResponse && r.agentResponse.trim() !== '').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Response</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reviews.filter(r => !r.agentResponse || r.agentResponse.trim() === '').length}
                </p>
              </div>
              <Reply className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="rating-filter">Rating</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="response-filter">Response Status</Label>
              <Select value={responseFilter} onValueChange={setResponseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="not-responded">Not Responded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.reviewID} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">
                            Review #{review.reviewID}
                          </span>
                          {getRatingBadge(review.rating)}
                          <span className="text-sm text-gray-500">
                            User ID: {review.userId}
                          </span>
                          <span className="text-sm text-gray-500">
                            Package ID: {review.packageId}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>

                        {review.timestamp && (
                          <p className="text-xs text-gray-500 mb-3">
                            Posted: {formatDate(review.timestamp)}
                          </p>
                        )}

                        {review.agentResponse && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Agent Response</p>
                                <p className="text-sm text-green-700">{review.agentResponse}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(!review.agentResponse || review.agentResponse.trim() === '') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-palette-teal hover:bg-palette-teal/90">
                              <Reply className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Respond to Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Provide a response to Review #{review.reviewID} from User {review.userId}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Customer Review:</p>
                                <div className="flex items-center space-x-2 mb-2">
                                  {renderStars(review.rating, 'w-4 h-4')}
                                  <span className="text-sm text-gray-600">{review.rating} out of 5</span>
                                </div>
                                <p className="text-sm text-gray-600">{review.comment}</p>
                              </div>
                              
                              <div>
                                <Label htmlFor="agent-response">Your Response</Label>
                                <Textarea
                                  id="agent-response"
                                  placeholder="Enter your response to this review..."
                                  value={agentResponse}
                                  onChange={(e) => setAgentResponse(e.target.value)}
                                  rows={4}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {agentResponse.length}/500 characters
                                </p>
                              </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel 
                                onClick={() => {
                                  setSelectedReview(null);
                                  setAgentResponse('');
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => {
                                  setSelectedReview(review);
                                  handleRespond();
                                }}
                                disabled={responding || !agentResponse.trim()}
                                className="bg-palette-teal hover:bg-palette-teal/90"
                              >
                                {responding ? 'Submitting...' : 'Submit Response'}
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

export default ReviewManagement; 