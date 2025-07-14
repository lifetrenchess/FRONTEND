import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import { Star, MessageCircle, PenTool, Eye } from 'lucide-react';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('form');
  const location = useLocation();
  const packageId = location.state?.packageId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-palette-orange via-palette-orange/90 to-palette-orange/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Reviews & <span className="text-palette-teal">Ratings</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Share your experience and read what others have to say about their travel adventures
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-palette-teal/10 to-palette-orange/10 p-1 rounded-lg">
                <TabsTrigger 
                  value="form" 
                  className="data-[state=active]:bg-white data-[state=active]:text-palette-teal data-[state=active]:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <PenTool className="w-4 h-4" />
                    <span>Write a Review</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="list"
                  className="data-[state=active]:bg-white data-[state=active]:text-palette-orange data-[state=active]:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Reviews</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="mt-0">
                <ReviewForm onReviewSubmitted={() => setActiveTab('list')} packageId={packageId} />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <ReviewList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-palette-orange/5 to-palette-teal/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Reviews Matter</h3>
                <p className="text-gray-600">Your feedback helps other travelers make informed decisions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-teal/20 to-palette-teal/30 rounded-full mb-4">
                    <Star className="w-8 h-8 text-palette-teal" />
                  </div>
                  <div className="text-xl font-bold text-palette-teal mb-1">Authentic Experiences</div>
                  <div className="text-sm text-gray-600">Real stories from real travelers</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-orange/20 to-palette-orange/30 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-palette-orange" />
                  </div>
                  <div className="text-xl font-bold text-palette-orange mb-1">Community Driven</div>
                  <div className="text-sm text-gray-600">Help others discover amazing destinations</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-peach/20 to-palette-peach/30 rounded-full mb-4">
                    <PenTool className="w-8 h-8 text-palette-peach" />
                  </div>
                  <div className="text-xl font-bold text-palette-peach mb-1">Share Your Story</div>
                  <div className="text-sm text-gray-600">Document your travel memories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 