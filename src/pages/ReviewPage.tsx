import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
          <p className="text-gray-600">Share your experience and read what others have to say</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="form">Write a Review</TabsTrigger>
            <TabsTrigger value="list">View Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <ReviewForm onReviewSubmitted={() => setActiveTab('list')} />
          </TabsContent>
          
          <TabsContent value="list">
            <ReviewList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewPage; 