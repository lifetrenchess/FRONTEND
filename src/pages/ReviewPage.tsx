import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MessageSquare, ArrowLeft, Send } from 'lucide-react';
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

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', '/reviews'));
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews');
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async () => {
    if (rating === 0 || comment.trim() === '') {
      toast.error('Please give a rating and feedback');
      return;
    }

    setIsSubmitting(true);

    const review = {
      userID: 1, // Replace with actual user ID from authentication
      packageID: 101, // Replace with actual package ID
      rating,
      comment,
    };

    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', '/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        fetchReviews(); // Refresh the reviews list
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
          <p className="text-gray-600">Help other travelers by sharing your feedback about our services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Review */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Write a Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rate your experience
                  </label>
                  <div className="flex items-center space-x-4">
                    {renderStars(rating, true, 'w-8 h-8')}
                    <span className="text-sm text-gray-600">
                      {rating > 0 ? `${rating} out of 5 stars` : 'Select rating'}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Share your feedback
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us about your experience with our travel services..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={submitReview}
                  disabled={isSubmitting || rating === 0 || comment.trim() === ''}
                  className="w-full bg-palette-orange hover:bg-palette-orange/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg">Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Be honest and specific about your experience</li>
                  <li>• Include details about the service quality</li>
                  <li>• Mention any issues you encountered</li>
                  <li>• Share what you enjoyed most</li>
                  <li>• Keep it respectful and constructive</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Reviews</span>
                  <span className="text-sm text-gray-500">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-teal"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={review.id || index} className="border rounded-lg p-4">
                        {/* Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating, false, 'w-4 h-4')}
                            <span className="text-sm text-gray-600">
                              {review.rating} out of 5
                            </span>
                          </div>
                          {review.createdAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Agent Response */}
                        {review.agentResponse && (
                          <>
                            <Separator className="my-3" />
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-palette-teal rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">Agent Response</span>
                              </div>
                              <p className="text-sm text-gray-700">{review.agentResponse}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-palette-teal">
                        {reviews.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-palette-teal">
                        {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 