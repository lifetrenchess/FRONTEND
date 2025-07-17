import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MessageCircle, Calendar, RefreshCw, Eye, TrendingUp, Users, Award } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface Review {
  id: number;
  userID: number;
  packageID: number;
  rating: number;
  comment: string;
  agentResponse?: string;
  createdAt?: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', ''));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (error: unknown) {
      console.error("Error fetching reviews:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reviews';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Not Rated";
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-orange-100 text-orange-800 border-orange-200";
      case 3: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 4: return "bg-blue-100 text-blue-800 border-blue-200";
      case 5: return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRatingIcon = (rating: number) => {
    switch (rating) {
      case 1: return "😞";
      case 2: return "😐";
      case 3: return "🙂";
      case 4: return "😊";
      case 5: return "😍";
      default: return "⭐";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-teal/20 to-palette-teal/30 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-palette-teal animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Reviews</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={fetchReviews} 
            variant="outline"
            className="border-palette-teal text-palette-teal hover:bg-palette-teal hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const agentResponses = reviews.filter(r => r.agentResponse).length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-palette-teal/5 to-palette-teal/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-palette-teal/20 to-palette-teal/30">
                  <Users className="w-6 h-6 text-palette-teal" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-palette-teal">{reviews.length}</p>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-palette-orange/5 to-palette-orange/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-palette-orange/20 to-palette-orange/30">
                  <Star className="w-6 h-6 text-palette-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-palette-orange">{averageRating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-green-500/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/30">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{positiveReviews}</p>
                  <p className="text-sm text-gray-600">Positive Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-palette-peach/5 to-palette-peach/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-palette-peach/20 to-palette-peach/30">
                  <Award className="w-6 h-6 text-palette-peach" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-palette-peach">{agentResponses}</p>
                  <p className="text-sm text-gray-600">Agent Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reviews Yet</h3>
            <p className="text-gray-600 text-lg">Be the first to share your experience and help other travelers!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
              <CardContent className="p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getRatingIcon(review.rating)}</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating 
                                ? "text-yellow-400 fill-current drop-shadow-sm" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${getRatingColor(review.rating)} font-medium`}>
                      {getRatingText(review.rating)}
                    </Badge>
                  </div>
                  {review.createdAt && (
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(review.createdAt)}
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed text-base">{review.comment}</p>
                </div>

                {/* Review Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">User ID: {review.userID}</span>
                  <span className="font-medium">Package ID: {review.packageID}</span>
                </div>

                {/* Agent Response */}
                {review.agentResponse && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 p-6 rounded-lg border border-palette-teal/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 rounded-full bg-gradient-to-br from-palette-teal/20 to-palette-teal/30">
                          <MessageCircle className="w-4 h-4 text-palette-teal" />
                        </div>
                        <span className="font-semibold text-palette-teal text-lg">Agent Response</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{review.agentResponse}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center pt-6">
        <Button 
          onClick={fetchReviews} 
          variant="outline"
          className="border-2 border-palette-teal text-palette-teal hover:bg-palette-teal hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Reviews
        </Button>
      </div>
    </div>
  );
};

export default ReviewList; 