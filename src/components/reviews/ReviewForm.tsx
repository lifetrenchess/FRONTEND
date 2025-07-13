import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface ReviewFormProps {
  packageId?: number;
  userId?: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  packageId = 101, 
  userId = 1, 
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

    setIsSubmitting(true);

    const feedback = {
      userID: userId,
      packageID: packageId,
      rating,
      comment,
    };

    try {
      const response = await fetch(getApiUrl('REVIEW_SERVICE', '/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        const errorText = await response.text();
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Rate Your Experience</CardTitle>
        <p className="text-gray-600 text-center">Share your thoughts about this travel package</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Stars */}
        <div className="text-center">
          <Label className="text-lg font-medium mb-4 block">Your Rating</Label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors ${
                  star <= rating 
                    ? "text-yellow-400 hover:text-yellow-500" 
                    : "text-gray-300 hover:text-gray-400"
                }`}
                type="button"
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment" className="text-lg font-medium">Your Review</Label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this travel package..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={submitFeedback}
          disabled={isSubmitting || rating === 0 || comment.trim() === ""}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>

        {/* Guidelines */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Share specific details about your experience</li>
            <li>• Avoid personal attacks or inappropriate content</li>
            <li>• Your review helps other travelers make informed decisions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm; 