import React, { useState, useRef } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

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
}

// Accordion Component
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
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{question}</CardTitle>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </CardHeader>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0px',
        }}
        ref={contentRef}
      >
        <CardContent>
          <p className="text-gray-600 mb-4">{answer}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectIssue(question)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Still need help? Submit this as your issue
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

const AssistancePage: React.FC = () => {
  // State for submitting new requests
  const [newRequestUserId, setNewRequestUserId] = useState<string>("");
  const [newRequestIssueDescription, setNewRequestIssueDescription] = useState<string>("");
  const [isSubmittingNewRequest, setIsSubmittingNewRequest] = useState<boolean>(false);

  // State for viewing existing requests
  const [viewRequestId, setViewRequestId] = useState<string>("");
  const [viewUserId, setViewUserId] = useState<string>("");
  const [viewedRequest, setViewedRequest] = useState<AssistanceDTO | null>(null);
  const [isViewingRequest, setIsViewingRequest] = useState<boolean>(false);

  // State for Admin Mode and Resolution
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminResolutionMessage, setAdminResolutionMessage] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Predefined FAQ data
  const faqs: FAQItem[] = [
    {
      question: "How do I change my booking dates?",
      answer: "To change your booking dates, please log in to your account and navigate to 'My Bookings'. Select the booking you wish to modify and look for the 'Change Dates' option. Note that date changes may be subject to availability and additional fees.",
    },
    {
      question: "What is the cancellation policy?",
      answer: "Our cancellation policy varies depending on the type of package and the time remaining before departure. Generally, cancellations made more than 30 days prior to travel receive a full refund, while those within 7-30 days incur a 50% penalty.",
    },
    {
      question: "I haven't received my booking confirmation.",
      answer: "Booking confirmations are usually sent to your registered email address within a few minutes of successful payment. Please check your spam or junk folder. If you still haven't received it after an hour, please submit this issue.",
    },
    {
      question: "How can I add extra services to my package?",
      answer: "You can add extra services such as airport transfers, special excursions, or meal upgrades by visiting the 'Manage Booking' section in your account. Select your package and choose the 'Add Services' option.",
    },
    {
      question: "My payment failed, but the amount was deducted.",
      answer: "If your payment failed but the amount was deducted from your account, it's likely a temporary hold that will be reversed by your bank within 3-5 business days. We recommend checking your bank statement after this period.",
    },
    {
      question: "I need to update my personal information (e.g., passport details).",
      answer: "To update personal information like passport details, contact numbers, or emergency contacts, please log in to your account and go to 'Profile Settings'. Make the necessary changes and save.",
    },
    {
      question: "How do I apply a discount code or voucher?",
      answer: "Discount codes and vouchers can typically be applied during the checkout process. Look for a field labeled 'Promo Code' or 'Voucher' before finalizing your payment. Enter the code and click 'Apply'.",
    },
    {
      question: "What travel documents do I need for my trip?",
      answer: "The required travel documents depend on your destination and nationality. Generally, a valid passport is essential for international travel. Some countries may also require visas.",
    },
    {
      question: "Can I get an invoice or receipt for my booking?",
      answer: "Yes, you can usually download an invoice or receipt from the 'My Bookings' section of your account after your payment is confirmed. Look for an option like 'Download Invoice' or 'Print Receipt'.",
    },
  ];

  const handleFAQSelect = (question: string) => {
    setNewRequestIssueDescription(question);
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNewRequest(true);

    if (!newRequestUserId || !newRequestIssueDescription) {
      toast.error("User ID and Issue Description are required.");
      setIsSubmittingNewRequest(false);
      return;
    }

    const parsedUserId = parseInt(newRequestUserId);
    if (isNaN(parsedUserId)) {
      toast.error("User ID must be a valid number.");
      setIsSubmittingNewRequest(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', '/assistance'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parsedUserId,
          issueDescription: newRequestIssueDescription,
        }),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json().catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(errorData.message || "Failed to submit request.");
      }

      const data: AssistanceDTO = await response.json();
      toast.success(`Request submitted successfully! Request ID: ${data.requestId}`);
      setNewRequestUserId("");
      setNewRequestIssueDescription("");
    } catch (error: any) {
      toast.error(`Failed to submit request: ${error.message}`);
    } finally {
      setIsSubmittingNewRequest(false);
    }
  };

  const handleViewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsViewingRequest(true);

    if (!viewRequestId || !viewUserId) {
      toast.error("Request ID and User ID are required.");
      setIsViewingRequest(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/assistance/${viewRequestId}`));
      
      if (!response.ok) {
        throw new Error("Request not found or access denied.");
      }

      const data: AssistanceDTO = await response.json();
      setViewedRequest(data);
    } catch (error: any) {
      toast.error(`Failed to fetch request: ${error.message}`);
      setViewedRequest(null);
    } finally {
      setIsViewingRequest(false);
    }
  };

  const handleAdminResolve = async () => {
    if (!viewedRequest || !adminResolutionMessage.trim()) {
      toast.error("Please enter a resolution message.");
      return;
    }

    setIsResolving(true);

    try {
      const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/assistance/${viewedRequest.requestId}/resolve`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resolutionMessage: adminResolutionMessage,
        }),
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Assistance</h1>
          <p className="text-gray-600">Get help with your bookings and travel queries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
          </div>

          {/* Request Forms */}
          <div className="space-y-6">
            {/* Submit New Request */}
            <Card>
              <CardHeader>
                <CardTitle>Submit New Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewRequestSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      type="number"
                      value={newRequestUserId}
                      onChange={(e) => setNewRequestUserId(e.target.value)}
                      placeholder="Enter your user ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="issueDescription">Issue Description</Label>
                    <Textarea
                      id="issueDescription"
                      value={newRequestIssueDescription}
                      onChange={(e) => setNewRequestIssueDescription(e.target.value)}
                      placeholder="Describe your issue or select from FAQ above"
                      rows={4}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmittingNewRequest}
                    className="w-full"
                  >
                    {isSubmittingNewRequest ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* View Existing Request */}
            <Card>
              <CardHeader>
                <CardTitle>View Request Status</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleViewRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="viewRequestId">Request ID</Label>
                    <Input
                      id="viewRequestId"
                      type="number"
                      value={viewRequestId}
                      onChange={(e) => setViewRequestId(e.target.value)}
                      placeholder="Enter request ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="viewUserId">User ID</Label>
                    <Input
                      id="viewUserId"
                      type="number"
                      value={viewUserId}
                      onChange={(e) => setViewUserId(e.target.value)}
                      placeholder="Enter your user ID"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isViewingRequest}
                    variant="outline"
                    className="w-full"
                  >
                    {isViewingRequest ? "Loading..." : "View Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Admin Mode Toggle */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="adminMode"
                    checked={isAdminMode}
                    onChange={(e) => setIsAdminMode(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="adminMode">Admin Mode</Label>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            {viewedRequest && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Request ID</Label>
                      <p className="font-medium">{viewedRequest.requestId}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Status</Label>
                      <Badge variant="secondary" className="mt-1">
                        {viewedRequest.status || 'PENDING'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Issue Description</Label>
                      <p className="text-sm">{viewedRequest.issueDescription}</p>
                    </div>
                    {viewedRequest.resolutionMessage && (
                      <div>
                        <Label className="text-sm text-gray-600">Resolution</Label>
                        <p className="text-sm">{viewedRequest.resolutionMessage}</p>
                      </div>
                    )}
                    
                    {isAdminMode && (
                      <div className="pt-4 border-t">
                        <Label htmlFor="resolutionMessage">Resolution Message</Label>
                        <Textarea
                          id="resolutionMessage"
                          value={adminResolutionMessage}
                          onChange={(e) => setAdminResolutionMessage(e.target.value)}
                          placeholder="Enter resolution message"
                          rows={3}
                          className="mt-2"
                        />
                        <Button
                          onClick={handleAdminResolve}
                          disabled={isResolving}
                          className="mt-3 w-full"
                        >
                          {isResolving ? "Resolving..." : "Resolve Request"}
                        </Button>
                      </div>
                    )}
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

export default AssistancePage; 