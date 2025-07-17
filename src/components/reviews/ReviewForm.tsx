import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, PenTool, Send, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';
import { getCurrentUserFromStorage } from '@/lib/auth';

interface ReviewFormProps {
  packageId?: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  packageId = 1, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please give a rating and feedback");
      return;
    }

    // Get current user from authentication
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      toast.error("Please log in to submit a review. You can still read reviews without logging in.");
      return;
    }

    // Validate packageId - ensure it's a valid positive number
    const validPackageId = packageId && packageId > 0 ? packageId : 1;
    if (validPackageId <= 0) {
      toast.error("Invalid package ID. Please try again.");
      return;
    }

    // Validate userId
    if (!currentUser.userId || currentUser.userId <= 0) {
      toast.error("Invalid user ID. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    const feedback = {
      userId: currentUser.userId,
      packageId: validPackageId,
      rating,
      comment,
    };

    console.log('Submitting review with data:', feedback);

    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Review submission error:', errorText);
        throw new Error(errorText || 'Failed to submit review');
      }

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error: unknown) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select Rating";
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return "text-red-500";
      case 2: return "text-orange-500";
      case 3: return "text-yellow-500";
      case 4: return "text-blue-500";
      case 5: return "text-green-500";
      default: return "text-gray-400";
    }
  };

  // Check if user is authenticated
  const currentUser = getCurrentUserFromStorage();
  const isAuthenticated = currentUser && currentUser.userId;

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 border-b border-palette-teal/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-palette-teal/20 to-palette-teal/30">
            <PenTool className="w-6 h-6 text-palette-teal" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Rate Your Experience</CardTitle>
            <p className="text-gray-600">Share your thoughts about this travel package</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Login Notice for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-palette-orange/5 to-palette-orange/10 p-4 rounded-lg border border-palette-orange/20">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-palette-orange" />
              <div>
                <p className="text-sm font-medium text-palette-orange">Login Required</p>
                <p className="text-sm text-gray-600">You need to be logged in to submit a review. You can still read reviews without logging in.</p>
              </div>
            </div>
          </div>
        )}

        {/* Rating Stars */}
        <div className="text-center">
          <Label className="text-lg font-medium text-gray-700 mb-6 block">Your Rating</Label>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all duration-200 transform hover:scale-110 ${
                  star <= rating 
                    ? "text-yellow-400 hover:text-yellow-500 drop-shadow-lg" 
                    : "text-gray-300 hover:text-gray-400"
                }`}
                type="button"
                disabled={!isAuthenticated}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className={`text-lg font-semibold ${getRatingColor(rating)} transition-colors duration-200`}>
              {getRatingText(rating)}
            </div>
          )}
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment" className="text-lg font-medium text-gray-700 mb-3 block">
            Your Review
          </Label>
          <Textarea
            id="comment"
            placeholder={isAuthenticated ? "Share your experience with this travel package... Tell us about the highlights, any challenges, and what made your trip special." : "Please log in to write a review..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="border-2 border-gray-200 focus:border-palette-teal focus:ring-palette-teal/20 transition-all duration-200 resize-none text-base"
            disabled={!isAuthenticated}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={submitFeedback}
          disabled={isSubmitting || rating === 0 || comment.trim() === "" || !isAuthenticated}
          className="w-full bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5" />
              <span>Login Required</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Send className="w-5 h-5" />
              <span>Submit Review</span>
            </div>
          )}
        </Button>

        {/* Guidelines */}
        <div className="bg-gradient-to-r from-palette-orange/5 to-palette-orange/10 p-6 rounded-lg border border-palette-orange/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-palette-orange/20 to-palette-orange/30">
              <Sparkles className="w-5 h-5 text-palette-orange" />
            </div>
            <h4 className="font-semibold text-palette-orange text-lg">Review Guidelines</h4>
          </div>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-palette-orange font-bold">•</span>
              <span>Be honest and constructive in your feedback</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-palette-orange font-bold">•</span>
              <span>Share specific details about your experience</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-palette-orange font-bold">•</span>
              <span>Avoid personal attacks or inappropriate content</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-palette-orange font-bold">•</span>
              <span>Your review helps other travelers make informed decisions</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm; 