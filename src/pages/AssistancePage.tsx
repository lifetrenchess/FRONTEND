import React, { useState, useRef } from "react";
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { 
  MessageCircle, 
  HelpCircle, 
  Search, 
  Send, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Star,
  Users,
  Globe,
  Calendar
} from 'lucide-react';

// Interface for the data received from/sent to the backend for an assistance request
interface AssistanceDTO {
  requestId?: number;
  userId: number;
  issueDescription: string;
  status?: string;
  resolutionTime?: string;
  resolutionMessage?: string;
}

// Interface for FAQ items
interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Accordion Component
interface AccordionItemProps {
  question: string;
  answer: string;
  onSelectIssue: (question: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  onSelectIssue,
  icon: Icon,
  category
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'border-l-palette-teal bg-gradient-to-r from-palette-teal/5 to-transparent';
      case 'payment': return 'border-l-palette-orange bg-gradient-to-r from-palette-orange/5 to-transparent';
      case 'general': return 'border-l-palette-peach bg-gradient-to-r from-palette-peach/5 to-transparent';
      default: return 'border-l-gray-300 bg-gradient-to-r from-gray-50 to-transparent';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'booking': return <Badge className="bg-palette-teal/10 text-palette-teal border-palette-teal/20">Booking</Badge>;
      case 'payment': return <Badge className="bg-palette-orange/10 text-palette-orange border-palette-orange/20">Payment</Badge>;
      case 'general': return <Badge className="bg-palette-peach/10 text-palette-peach border-palette-peach/20">General</Badge>;
      default: return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <Card className={`mb-4 border-l-4 transition-all duration-300 hover:shadow-md ${getCategoryColor(category)}`}>
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-palette-teal/10 to-palette-teal/20">
              <Icon className="w-5 h-5 text-palette-teal" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base text-gray-900">{question}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getCategoryBadge(category)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </span>
          </div>
        </div>
      </CardHeader>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0px',
        }}
        ref={contentRef}
      >
        <CardContent className="pt-0">
          <div className="bg-white/50 rounded-lg p-4 mb-4">
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectIssue(question)}
            className="w-full bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 border-palette-teal/20 text-palette-teal hover:from-palette-teal/10 hover:to-palette-teal/20 hover:border-palette-teal/30 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Still need help? Submit this as your issue
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

const AssistancePage: React.FC = () => {
  // State for submitting new requests
  const [newRequestIssueDescription, setNewRequestIssueDescription] = useState<string>("");
  const [isSubmittingNewRequest, setIsSubmittingNewRequest] = useState<boolean>(false);

  // State for viewing existing requests
  const [viewRequestId, setViewRequestId] = useState<string>("");
  const [viewedRequest, setViewedRequest] = useState<AssistanceDTO | null>(null);
  const [isViewingRequest, setIsViewingRequest] = useState<boolean>(false);

  // State for Admin Mode and Resolution
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminResolutionMessage, setAdminResolutionMessage] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");

  // Predefined FAQ data with categories and icons
  const faqs: FAQItem[] = [
    {
      question: "How do I change my booking dates?",
      answer: "To change your booking dates, please log in to your account and navigate to 'My Bookings'. Select the booking you wish to modify and look for the 'Change Dates' option. Note that date changes may be subject to availability and additional fees.",
      category: "booking",
      icon: Calendar
    },
    {
      question: "What is the cancellation policy?",
      answer: "Our cancellation policy varies depending on the type of package and the time remaining before departure. Generally, cancellations made more than 30 days prior to travel receive a full refund, while those within 7-30 days incur a 50% penalty.",
      category: "booking",
      icon: Shield
    },
    {
      question: "I haven't received my booking confirmation.",
      answer: "Booking confirmations are usually sent to your registered email address within a few minutes of successful payment. Please check your spam or junk folder. If you still haven't received it after an hour, please submit this issue.",
      category: "general",
      icon: MessageCircle
    },
    {
      question: "How can I add extra services to my package?",
      answer: "You can add extra services such as airport transfers, special excursions, or meal upgrades by visiting the 'Manage Booking' section in your account. Select your package and choose the 'Add Services' option.",
      category: "booking",
      icon: Star
    },
    {
      question: "My payment failed, but the amount was deducted.",
      answer: "If your payment failed but the amount was deducted from your account, it's likely a temporary hold that will be reversed by your bank within 3-5 business days. We recommend checking your bank statement after this period.",
      category: "payment",
      icon: AlertCircle
    },
    {
      question: "I need to update my personal information (e.g., passport details).",
      answer: "To update personal information like passport details, contact numbers, or emergency contacts, please log in to your account and go to 'Profile Settings'. Make the necessary changes and save.",
      category: "general",
      icon: Users
    },
    {
      question: "How do I apply a discount code or voucher?",
      answer: "Discount codes and vouchers can typically be applied during the checkout process. Look for a field labeled 'Promo Code' or 'Voucher' before finalizing your payment. Enter the code and click 'Apply'.",
      category: "payment",
      icon: Star
    },
    {
      question: "What travel documents do I need for my trip?",
      answer: "The required travel documents depend on your destination and nationality. Generally, a valid passport is essential for international travel. Some countries may also require visas.",
      category: "general",
      icon: Globe
    },
    {
      question: "Can I get an invoice or receipt for my booking?",
      answer: "Yes, you can usually download an invoice or receipt from the 'My Bookings' section of your account after your payment is confirmed. Look for an option like 'Download Invoice' or 'Print Receipt'.",
      category: "general",
      icon: MessageCircle
    },
  ];

  const handleFAQSelect = (question: string) => {
    setNewRequestIssueDescription(question);
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequestIssueDescription.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    // Check if user is authenticated
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      toast.error("Please log in to submit a support request. You can still browse our FAQ section.");
      return;
    }

    setIsSubmittingNewRequest(true);

    const assistanceRequest: AssistanceDTO = {
      userId: currentUser.userId,
      issueDescription: newRequestIssueDescription,
    };

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistanceRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit request');
      }

      const result = await response.json();
      toast.success("Support request submitted successfully! We'll get back to you soon.");
      setNewRequestIssueDescription("");
      
      // Show the request ID to the user
      if (result.requestId) {
        toast.info(`Your request ID is: ${result.requestId}. Please save this for reference.`);
      }
    } catch (error: unknown) {
      console.error('Error submitting assistance request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingNewRequest(false);
    }
  };

  const handleViewRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!viewRequestId.trim()) {
      toast.error("Please enter a request ID");
      return;
    }

    // Check if user is authenticated
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      toast.error("Please log in to view your support requests.");
      return;
    }

    setIsViewingRequest(true);

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/${viewRequestId}`));
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Request not found. Please check your request ID.');
      }
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch request');
      }

      const request = await response.json();
      setViewedRequest(request);
      toast.success("Request details loaded successfully!");
    } catch (error: unknown) {
      console.error('Error fetching assistance request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch request. Please try again.';
      toast.error(errorMessage);
      setViewedRequest(null);
    } finally {
      setIsViewingRequest(false);
    }
  };

  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      setPasswordError("Please enter admin password");
      return;
    }

    try {
      // Use the existing admin credentials from database
      const adminCredentials = {
        userEmail: "lifetrenchess@gmail.com",
        userPassword: adminPassword
      };

      const response = await fetch(getApiUrl('USER_SERVICE', '/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials),
      });

      if (response.ok) {
        const token = await response.text(); // Login returns token as string
        
        // Use the token to fetch user details
        const userResponse = await fetch(getApiUrl('USER_SERVICE', '/me'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Check if the logged-in user is actually an admin
          if (userData.userRole === 'ADMIN') {
            setIsAdminMode(true);
            setShowPasswordInput(false);
            setPasswordError("");
            setAdminPassword("");
            toast.success("Admin access granted!");
          } else {
            setPasswordError("Access denied. Admin privileges required.");
            setAdminPassword("");
          }
        } else {
          setPasswordError("Failed to verify admin privileges");
          setAdminPassword("");
        }
      } else {
        setPasswordError("Invalid admin credentials");
        setAdminPassword("");
      }
    } catch (error) {
      console.error('Admin authentication error:', error);
      setPasswordError("Authentication failed. Please try again.");
      setAdminPassword("");
    }
  };

  const handleAdminResolve = async () => {
    if (!viewedRequest || !adminResolutionMessage.trim()) {
      toast.error("Please enter a resolution message.");
      return;
    }

    setIsResolving(true);

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/${viewedRequest.requestId}/resolve`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminResolutionMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve request.");
      }

      toast.success("Request resolved successfully!");
      setAdminResolutionMessage("");
      setViewedRequest(null);
    } catch (error: any) {
      toast.error(`Failed to resolve request: ${error.message}`);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-palette-teal to-palette-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Customer <span className="text-palette-cream">Support</span>
            </h1>
            <p className="text-xl text-palette-cream/90 max-w-3xl mx-auto">
              We're here to help! Find answers to common questions or submit a support request.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 border-b border-palette-teal/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-palette-teal/20 to-palette-teal/30">
                    <HelpCircle className="w-6 h-6 text-palette-teal" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Frequently Asked Questions</CardTitle>
                    <p className="text-gray-600">Find quick answers to common questions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      onSelectIssue={handleFAQSelect}
                      icon={faq.icon}
                      category={faq.category}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Forms */}
          <div className="space-y-6">
            {/* Submit New Request */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-palette-orange/5 to-palette-orange/10 border-b border-palette-orange/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-palette-orange/20 to-palette-orange/30">
                    <Send className="w-6 h-6 text-palette-orange" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Submit New Request</CardTitle>
                    <p className="text-gray-600">Create a new assistance request</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleNewRequestSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="issueDescription" className="text-base font-medium text-gray-700 mb-2 block">
                      Issue Description
                    </Label>
                    <Textarea
                      id="issueDescription"
                      value={newRequestIssueDescription}
                      onChange={(e) => setNewRequestIssueDescription(e.target.value)}
                      placeholder="Describe your issue or select from FAQ above..."
                      rows={4}
                      className="border-2 border-gray-200 focus:border-palette-teal focus:ring-palette-teal/20 transition-all duration-200 resize-none"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmittingNewRequest}
                    className="w-full bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    {isSubmittingNewRequest ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Submit Request</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* View Existing Request */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-palette-peach/5 to-palette-peach/10 border-b border-palette-peach/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-palette-peach/20 to-palette-peach/30">
                    <Eye className="w-6 h-6 text-palette-peach" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">View Request Status</CardTitle>
                    <p className="text-gray-600">Check the status of your existing requests</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleViewRequest} className="space-y-6">
                  <div>
                    <Label htmlFor="viewRequestId" className="text-base font-medium text-gray-700 mb-2 block">
                      Request ID
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="viewRequestId"
                        type="number"
                        value={viewRequestId}
                        onChange={(e) => setViewRequestId(e.target.value)}
                        placeholder="Enter your request ID"
                        className="pl-10 border-2 border-gray-200 focus:border-palette-peach focus:ring-palette-peach/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isViewingRequest}
                    variant="outline"
                    className="w-full border-2 border-palette-peach text-palette-peach hover:bg-palette-peach hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    {isViewingRequest ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-palette-peach/30 border-t-palette-peach rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View Request</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Admin Mode Toggle */}
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="adminMode"
                      checked={isAdminMode}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShowPasswordInput(true);
                          } else {
                            setIsAdminMode(false);
                            setShowPasswordInput(false);
                            setPasswordError("");
                          }
                        }}
                      className="w-5 h-5 text-palette-teal bg-gray-100 border-gray-300 rounded focus:ring-palette-teal focus:ring-2"
                    />
                    <Label htmlFor="adminMode" className="text-base font-medium text-gray-700">Admin Mode</Label>
                    </div>
                    {isAdminMode && (
                      <div className="mt-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Admin access granted</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Admin Password Input */}
                {showPasswordInput && !isAdminMode && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                    <form onSubmit={handleAdminPasswordSubmit} className="space-y-3">
                      <div>
                        <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700 mb-1 block">
                          Admin Credentials Required
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Email: lifetrenchess@gmail.com</p>
                        <Input
                          id="adminPassword"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password (Ayush@1806)"
                          className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                          required
                        />
                        {passwordError && (
                          <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                        >
                          Verify Password
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordInput(false);
                            setPasswordError("");
                            setAdminPassword("");
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Details */}
            {viewedRequest && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border-l-4 border-l-palette-teal">
                <CardHeader className="bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 border-b border-palette-teal/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-gradient-to-br from-palette-teal/20 to-palette-teal/30">
                      <MessageCircle className="w-6 h-6 text-palette-teal" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Request Details</CardTitle>
                      <p className="text-gray-600">View your assistance request information</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-palette-teal/5 to-palette-teal/10 p-4 rounded-lg">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">Request ID</Label>
                        <p className="font-bold text-lg text-palette-teal">#{viewedRequest.requestId}</p>
                      </div>
                      <div className="bg-gradient-to-r from-palette-orange/5 to-palette-orange/10 p-4 rounded-lg">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">Status</Label>
                        <Badge 
                          variant="secondary" 
                          className={`mt-1 ${
                            viewedRequest.status === 'Resolved' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                          }`}
                        >
                          {viewedRequest.status === 'Resolved' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {viewedRequest.status || 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 p-4 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-600 mb-2 block">Issue Description</Label>
                      <p className="text-gray-800 leading-relaxed">{viewedRequest.issueDescription}</p>
                    </div>
                    
                    {viewedRequest.resolutionMessage && (
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <Label className="text-sm font-medium text-green-800 mb-1 block">Resolution</Label>
                            <p className="text-green-700 leading-relaxed">{viewedRequest.resolutionMessage}</p>
                            {viewedRequest.resolutionTime && (
                              <p className="text-xs text-green-600 mt-2">
                                Resolved: {new Date(viewedRequest.resolutionTime).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isAdminMode && (
                      <div className="pt-4 border-t border-gray-200">
                        <Label htmlFor="resolutionMessage" className="text-base font-medium text-gray-700 mb-2 block">
                          Resolution Message
                        </Label>
                        <Textarea
                          id="resolutionMessage"
                          value={adminResolutionMessage}
                          onChange={(e) => setAdminResolutionMessage(e.target.value)}
                          placeholder="Enter resolution message for the user..."
                          rows={3}
                          className="border-2 border-gray-200 focus:border-palette-teal focus:ring-palette-teal/20 transition-all duration-200 resize-none"
                        />
                        <Button
                          onClick={handleAdminResolve}
                          disabled={isResolving}
                          className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          {isResolving ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Resolving...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Resolve Request</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-palette-teal/5 to-palette-orange/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Support Statistics</h3>
                <p className="text-gray-600">We're here to help you every step of the way</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-teal/20 to-palette-teal/30 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-palette-teal" />
                  </div>
                  <div className="text-3xl font-bold text-palette-teal mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-orange/20 to-palette-orange/30 rounded-full mb-4">
                    <Clock className="w-8 h-8 text-palette-orange" />
                  </div>
                  <div className="text-3xl font-bold text-palette-orange mb-1">&lt;2h</div>
                  <div className="text-sm text-gray-600">Average Response</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palette-peach/20 to-palette-peach/30 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-palette-peach" />
                  </div>
                  <div className="text-3xl font-bold text-palette-peach mb-1">98%</div>
                  <div className="text-sm text-gray-600">Resolution Rate</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4">
                    <Star className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-700 mb-1">4.9★</div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssistancePage; 