import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, MessageCircle, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';
import UserAssistanceRequests from '@/components/user/UserAssistanceRequests';

interface AssistanceDTO {
  requestId?: number;
  userId: number;
  issueDescription: string;
  status?: string;
  resolutionTime?: string;
  resolutionMessage?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionItemProps {
  question: string;
  answer: string;
  onSelectIssue: (question: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  onSelectIssue,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{question}</CardTitle>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          }}
          ref={contentRef}
        >
          <p className="text-gray-600 mb-4">{answer}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectIssue(question)}
            className="text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white"
          >
            Still need help? Submit this as your issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AssistancePage = () => {
  const [newRequestUserId, setNewRequestUserId] = useState<string>('');
  const [newRequestIssueDescription, setNewRequestIssueDescription] = useState<string>('');
  const [newRequestSubmissionMessage, setNewRequestSubmissionMessage] = useState<string>('');
  const [newRequestSubmissionError, setNewRequestSubmissionError] = useState<string>('');
  const [isSubmittingNewRequest, setIsSubmittingNewRequest] = useState<boolean>(false);

  const [viewRequestId, setViewRequestId] = useState<string>('');
  const [viewUserId, setViewUserId] = useState<string>('');
  const [viewedRequest, setViewedRequest] = useState<AssistanceDTO | null>(null);
  const [viewRequestError, setViewRequestError] = useState<string>('');
  const [isViewingRequest, setIsViewingRequest] = useState<boolean>(false);

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminResolutionMessage, setAdminResolutionMessage] = useState<string>('');
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [adminResolutionError, setAdminResolutionError] = useState<string>('');
  const [adminResolutionSuccess, setAdminResolutionSuccess] = useState<string>('');
  
  // Get current user from localStorage
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.userId) {
          setCurrentUserId(userData.userId);
          setNewRequestUserId(userData.userId.toString());
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const faqs: FAQItem[] = [
    {
      question: "How do I change my booking dates?",
      answer: "To change your booking dates, please log in to your account and navigate to 'My Bookings'. Select the booking you wish to modify and look for the 'Change Dates' option. Note that date changes may be subject to availability and additional fees. If you encounter any issues, please submit this request.",
    },
    {
      question: "What is the cancellation policy?",
      answer: "Our cancellation policy varies depending on the type of package and the time remaining before departure. Generally, cancellations made more than 30 days prior to travel receive a full refund, while those within 7-30 days incur a 50% penalty. Cancellations within 7 days are non-refundable. Please refer to your booking confirmation for specific terms or submit this issue for clarification.",
    },
    {
      question: "I haven't received my booking confirmation.",
      answer: "Booking confirmations are usually sent to your registered email address within a few minutes of successful payment. Please check your spam or junk folder. If you still haven't received it after an hour, there might be an issue with your email address or the booking process. Please submit this issue with your booking details if possible.",
    },
    {
      question: "How can I add extra services to my package?",
      answer: "You can add extra services such as airport transfers, special excursions, or meal upgrades by visiting the 'Manage Booking' section in your account. Select your package and choose the 'Add Services' option. Availability and pricing will be displayed there. If the service you want is not listed, please submit this request.",
    },
    {
      question: "My payment failed, but the amount was deducted.",
      answer: "If your payment failed but the amount was deducted from your account, it's likely a temporary hold that will be reversed by your bank within 3-5 business days. We recommend checking your bank statement after this period. If the amount is not reversed, please submit this issue with your transaction details and bank statement for investigation.",
    },
    {
      question: "I need to update my personal information (e.g., passport details).",
      answer: "To update personal information like passport details, contact numbers, or emergency contacts, please log in to your account and go to 'Profile Settings'. Make the necessary changes and save. For critical changes like name corrections on a confirmed booking, you might need to submit an assistance request as airline policies may apply.",
    },
    {
      question: "How do I apply a discount code or voucher?",
      answer: "Discount codes and vouchers can typically be applied during the checkout process. Look for a field labeled 'Promo Code' or 'Voucher' before finalizing your payment. Enter the code and click 'Apply' to see the discount reflected in your total. If the code doesn't work, ensure it's valid for your selected package and not expired, then submit this request if issues persist.",
    },
    {
      question: "What travel documents do I need for my trip?",
      answer: "The required travel documents depend on your destination and nationality. Generally, a valid passport is essential for international travel. Some countries may also require visas. It's recommended to check the embassy or consulate website of your destination country well in advance. For specific guidance related to your booking, please submit this request.",
    },
    {
      question: "Can I get an invoice or receipt for my booking?",
      answer: "Yes, you can usually download an invoice or receipt from the 'My Bookings' section of your account after your payment is confirmed. Look for an option like 'Download Invoice' or 'Print Receipt'. If you're unable to find it or require a specific format, please submit this request, providing your booking reference.",
    },
  ];

  const handleFAQSelect = (question: string) => {
    setNewRequestIssueDescription(question);
    setNewRequestSubmissionMessage('');
    setNewRequestSubmissionError('');
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewRequestSubmissionMessage('');
    setNewRequestSubmissionError('');
    setIsSubmittingNewRequest(true);

    if (!newRequestIssueDescription) {
      setNewRequestSubmissionError('Issue Description is required.');
      setIsSubmittingNewRequest(false);
      return;
    }

    let parsedUserId: number;
    if (currentUserId) {
      parsedUserId = currentUserId;
    } else {
      if (!newRequestUserId) {
        setNewRequestSubmissionError('User ID and Issue Description are required.');
        setIsSubmittingNewRequest(false);
        return;
      }
      parsedUserId = parseInt(newRequestUserId);
      if (isNaN(parsedUserId)) {
        setNewRequestSubmissionError('User ID must be a valid number.');
        setIsSubmittingNewRequest(false);
        return;
      }
    }

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', '/assistance'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parsedUserId,
          issueDescription: newRequestIssueDescription,
        }),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response
          .json()
          .catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to submit request.');
      }

      const data: AssistanceDTO = await response.json();
      setNewRequestSubmissionMessage(
        `Request submitted successfully! Your Request ID is: ${data.requestId}. Status: ${data.status}`
      );
      setNewRequestUserId('');
      setNewRequestIssueDescription('');
      toast.success('Assistance request submitted successfully!');
    } catch (error: any) {
      console.error('Submission error:', error);
      setNewRequestSubmissionError(`Error submitting request: ${error.message}`);
      toast.error('Failed to submit assistance request');
    } finally {
      setIsSubmittingNewRequest(false);
    }
  };

  const handleViewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewedRequest(null);
    setViewRequestError('');
    setIsViewingRequest(true);
    setAdminResolutionError('');
    setAdminResolutionSuccess('');

    if (!viewRequestId || !viewUserId) {
      setViewRequestError('Request ID and User ID are required to view a request.');
      setIsViewingRequest(false);
      return;
    }

    const parsedRequestId = parseInt(viewRequestId);
    const parsedUserId = parseInt(viewUserId);

    if (isNaN(parsedRequestId) || isNaN(parsedUserId)) {
      setViewRequestError('Request ID and User ID must be valid numbers.');
      setIsViewingRequest(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/assistance/${parsedRequestId}`));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Request not found. Please check the ID.');
        }
        const errorData: { message?: string } = await response
          .json()
          .catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to fetch request.');
      }

      const data: AssistanceDTO = await response.json();
      if (data.userId !== parsedUserId) {
        throw new Error('Request ID does not match the provided User ID.');
      }
      setViewedRequest(data);
      if (isAdminMode && data.status === 'Pending') {
        setAdminResolutionMessage(data.resolutionMessage || '');
      }
      toast.success('Request details loaded successfully');
    } catch (error: any) {
      console.error('View request error:', error);
      setViewRequestError(`Error viewing request: ${error.message}`);
      toast.error('Failed to load request details');
    } finally {
      setIsViewingRequest(false);
    }
  };

  const handleAdminResolve = async () => {
    if (!viewedRequest || !adminResolutionMessage.trim()) {
      setAdminResolutionError('Resolution message cannot be empty.');
      return;
    }

    setIsResolving(true);
    setAdminResolutionError('');
    setAdminResolutionSuccess('');

    try {
      const response = await fetch(
        getApiUrl('ASSISTANCE_SERVICE', `/assistance/${viewedRequest.requestId}/resolve`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: adminResolutionMessage,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to resolve request: ${errorText || response.statusText}`
        );
      }

      const updatedRequest: AssistanceDTO = await response.json();
      setViewedRequest(updatedRequest);
      setAdminResolutionSuccess('Request resolved successfully!');
      setAdminResolutionMessage('');
      toast.success('Request resolved successfully!');
    } catch (err: any) {
      console.error('Resolve error:', err);
      setAdminResolutionError(`Error resolving request: ${err.message}`);
      toast.error('Failed to resolve request');
    } finally {
      setIsResolving(false);
    }
  };

  const handleNewRequestClick = () => {
    // Scroll to the new request form
    const newRequestSection = document.getElementById('new-request-section');
    if (newRequestSection) {
      newRequestSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Support</h1>
          <p className="text-gray-600">Get help with your bookings, travel plans, and any questions you may have</p>
        </div>

        {/* Admin Mode Toggle */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="adminModeToggle"
                checked={isAdminMode}
                onCheckedChange={(checked) => setIsAdminMode(checked as boolean)}
              />
              <Label htmlFor="adminModeToggle" className="text-sm font-medium">
                Admin Mode
              </Label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="my-requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="new-request">New Request</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-6">
            {currentUserId ? (
              <UserAssistanceRequests 
                userId={currentUserId} 
                onNewRequest={handleNewRequestClick}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Please log in to view your assistance requests.</p>
                  <Button onClick={handleNewRequestClick} className="bg-palette-orange hover:bg-palette-orange/90">
                    Submit a New Request
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* New Request Tab */}
          <TabsContent value="new-request" className="space-y-6">
            <div id="new-request-section">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Submit a New Request</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewRequestSubmit} className="space-y-4">
                    {!currentUserId && (
                      <div>
                        <Label htmlFor="newRequestUserId">User ID</Label>
                        <Input
                          id="newRequestUserId"
                          type="text"
                          placeholder="Enter your user ID (e.g., 123)"
                          value={newRequestUserId}
                          onChange={(e) => setNewRequestUserId(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="newRequestIssueDescription">Issue Description</Label>
                      <Textarea
                        id="newRequestIssueDescription"
                        placeholder="Describe your issue in detail"
                        value={newRequestIssueDescription}
                        onChange={(e) => setNewRequestIssueDescription(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingNewRequest}
                      className="w-full bg-palette-orange hover:bg-palette-orange/90"
                    >
                      {isSubmittingNewRequest ? 'Submitting...' : 'Submit Assistance Request'}
                    </Button>

                    {newRequestSubmissionMessage && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-green-700">{newRequestSubmissionMessage}</p>
                        </div>
                      </div>
                    )}
                    {newRequestSubmissionError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-700">{newRequestSubmissionError}</p>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* View Existing Request (Admin Mode) */}
              {isAdminMode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>View Existing Request</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleViewRequest} className="space-y-4">
                      <div>
                        <Label htmlFor="viewRequestId">Request ID</Label>
                        <Input
                          id="viewRequestId"
                          type="text"
                          placeholder="Enter Request ID"
                          value={viewRequestId}
                          onChange={(e) => setViewRequestId(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="viewUserId">User ID</Label>
                        <Input
                          id="viewUserId"
                          type="text"
                          placeholder="Enter User ID"
                          value={viewUserId}
                          onChange={(e) => setViewUserId(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isViewingRequest}
                        variant="outline"
                        className="w-full"
                      >
                        {isViewingRequest ? 'Loading...' : 'View Request Details'}
                      </Button>
                      {viewRequestError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-700">{viewRequestError}</p>
                          </div>
                        </div>
                      )}
                    </form>

                    {viewedRequest && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Request Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Request ID:</span>
                            <span className="font-medium">#{viewedRequest.requestId}</span>
                          </div>
                                                {isAdminMode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">User ID:</span>
                          <span className="font-medium">{viewedRequest.userId}</span>
                        </div>
                      )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${
                              viewedRequest.status === 'Resolved' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {viewedRequest.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Issue Description:</span>
                            <p className="text-gray-900 mt-1">{viewedRequest.issueDescription}</p>
                          </div>

                          {viewedRequest.status === 'Resolved' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Resolved At:</span>
                                <span className="font-medium">
                                  {viewedRequest.resolutionTime
                                    ? new Date(viewedRequest.resolutionTime).toLocaleString()
                                    : 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Admin Reply:</span>
                                <p className="text-gray-900 mt-1">
                                  {viewedRequest.resolutionMessage || 'No resolution message provided.'}
                                </p>
                              </div>
                            </>
                          )}

                          {/* Admin Resolution Section */}
                          {isAdminMode && viewedRequest.status === 'Pending' && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-3">Admin Resolution</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="adminResolutionMessage">Resolution Message:</Label>
                                  <Textarea
                                    id="adminResolutionMessage"
                                    value={adminResolutionMessage}
                                    onChange={(e) => setAdminResolutionMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Enter admin's resolution message"
                                  />
                                </div>
                                <Button
                                  onClick={handleAdminResolve}
                                  disabled={isResolving}
                                  className="bg-palette-teal hover:bg-palette-teal/90"
                                >
                                  {isResolving ? 'Resolving...' : 'Resolve Request'}
                                </Button>
                                {adminResolutionSuccess && (
                                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <p className="text-sm text-green-700">{adminResolutionSuccess}</p>
                                    </div>
                                  </div>
                                )}
                                {adminResolutionError && (
                                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                      <p className="text-sm text-red-700">{adminResolutionError}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Questions & Quick Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      onSelectIssue={handleFAQSelect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssistancePage; 