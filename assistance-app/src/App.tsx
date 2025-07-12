import React, { useState, useRef } from "react";
import "./App.css"; // Import the CSS file

// Mock API base URL for demonstration
const API_BASE_URL = "http://localhost:9005/api/assistance"; // Ensure this matches your backend URL

// --- TypeScript Interfaces for Data Models ---

// Interface for the data received from/sent to the backend for an assistance request
interface AssistanceDTO {
  requestId?: number; // Optional as it's auto-generated on creation
  userId: number;
  issueDescription: string;
  status?: string; // Optional as it's set by backend on creation/resolution
  resolutionTime?: string; // Stored as string (ISO 8601) from backend LocalDateTime
  resolutionMessage?: string; // Optional, set by admin
}

// Interface for FAQ items
interface FAQItem {
  question: string;
  answer: string;
}

// --- Accordion Component ---
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
  const contentRef = useRef<HTMLDivElement>(null); // Specify HTMLDivElement for ref

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`accordion-icon ${isOpen ? "open" : ""}`}>
          &#9660;
        </span>
      </button>
      <div
        className="accordion-content"
        style={{
          maxHeight:
            isOpen && contentRef.current
              ? `${contentRef.current.scrollHeight}px`
              : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
        ref={contentRef}
      >
        <p>{answer}</p>
        <button
          className="submit-faq-button"
          onClick={() => onSelectIssue(question)}
        >
          Still need help? Submit this as your issue
        </button>
      </div>
    </div>
  );
};

// --- Main Assistance Page Component (Customer & Admin Functionality) ---
const AssistancePage: React.FC = () => {
  // State for submitting new requests
  const [newRequestUserId, setNewRequestUserId] = useState<string>("");
  const [newRequestIssueDescription, setNewRequestIssueDescription] =
    useState<string>("");
  const [newRequestSubmissionMessage, setNewRequestSubmissionMessage] =
    useState<string>("");
  const [newRequestSubmissionError, setNewRequestSubmissionError] =
    useState<string>("");
  const [isSubmittingNewRequest, setIsSubmittingNewRequest] =
    useState<boolean>(false);

  // State for viewing existing requests
  const [viewRequestId, setViewRequestId] = useState<string>("");
  const [viewUserId, setViewUserId] = useState<string>("");
  const [viewedRequest, setViewedRequest] = useState<AssistanceDTO | null>(
    null
  );
  const [viewRequestError, setViewRequestError] = useState<string>("");
  const [isViewingRequest, setIsViewingRequest] = useState<boolean>(false);

  // State for Admin Mode and Resolution
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminResolutionMessage, setAdminResolutionMessage] =
    useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [adminResolutionError, setAdminResolutionError] = useState<string>("");
  const [adminResolutionSuccess, setAdminResolutionSuccess] =
    useState<string>("");

  // Predefined FAQ data
  const faqs: FAQItem[] = [
    {
      question: "How do I change my booking dates?",
      answer:
        "To change your booking dates, please log in to your account and navigate to 'My Bookings'. Select the booking you wish to modify and look for the 'Change Dates' option. Note that date changes may be subject to availability and additional fees. If you encounter any issues, please submit this request.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Our cancellation policy varies depending on the type of package and the time remaining before departure. Generally, cancellations made more than 30 days prior to travel receive a full refund, while those within 7-30 days incur a 50% penalty. Cancellations within 7 days are non-refundable. Please refer to your booking confirmation for specific terms or submit this issue for clarification.",
    },
    {
      question: "I haven't received my booking confirmation.",
      answer:
        "Booking confirmations are usually sent to your registered email address within a few minutes of successful payment. Please check your spam or junk folder. If you still haven't received it after an hour, there might be an issue with your email address or the booking process. Please submit this issue with your booking details if possible.",
    },
    {
      question: "How can I add extra services to my package?",
      answer:
        "You can add extra services such as airport transfers, special excursions, or meal upgrades by visiting the 'Manage Booking' section in your account. Select your package and choose the 'Add Services' option. Availability and pricing will be displayed there. If the service you want is not listed, please submit this request.",
    },
    {
      question: "My payment failed, but the amount was deducted.",
      answer:
        "If your payment failed but the amount was deducted from your account, it's likely a temporary hold that will be reversed by your bank within 3-5 business days. We recommend checking your bank statement after this period. If the amount is not reversed, please submit this issue with your transaction details and bank statement for investigation.",
    },
    {
      question:
        "I need to update my personal information (e.g., passport details).",
      answer:
        "To update personal information like passport details, contact numbers, or emergency contacts, please log in to your account and go to 'Profile Settings'. Make the necessary changes and save. For critical changes like name corrections on a confirmed booking, you might need to submit an assistance request as airline policies may apply.",
    },
    {
      question: "How do I apply a discount code or voucher?",
      answer:
        "Discount codes and vouchers can typically be applied during the checkout process. Look for a field labeled 'Promo Code' or 'Voucher' before finalizing your payment. Enter the code and click 'Apply' to see the discount reflected in your total. If the code doesn't work, ensure it's valid for your selected package and not expired, then submit this request if issues persist.",
    },
    {
      question: "What travel documents do I need for my trip?",
      answer:
        "The required travel documents depend on your destination and nationality. Generally, a valid passport is essential for international travel. Some countries may also require visas. It's recommended to check the embassy or consulate website of your destination country well in advance. For specific guidance related to your booking, please submit this request.",
    },
    {
      question: "Can I get an invoice or receipt for my booking?",
      answer:
        "Yes, you can usually download an invoice or receipt from the 'My Bookings' section of your account after your payment is confirmed. Look for an option like 'Download Invoice' or 'Print Receipt'. If you're unable to find it or require a specific format, please submit this request, providing your booking reference.",
    },
  ];

  const handleFAQSelect = (question: string) => {
    setNewRequestIssueDescription(question);
    setNewRequestSubmissionMessage("");
    setNewRequestSubmissionError("");
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewRequestSubmissionMessage("");
    setNewRequestSubmissionError("");
    setIsSubmittingNewRequest(true);

    if (!newRequestUserId || !newRequestIssueDescription) {
      setNewRequestSubmissionError(
        "User ID and Issue Description are required."
      );
      setIsSubmittingNewRequest(false);
      return;
    }

    const parsedUserId = parseInt(newRequestUserId);
    if (isNaN(parsedUserId)) {
      setNewRequestSubmissionError("User ID must be a valid number.");
      setIsSubmittingNewRequest(false);
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
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
        const errorData: { message?: string } = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(errorData.message || "Failed to submit request.");
      }

      const data: AssistanceDTO = await response.json();
      setNewRequestSubmissionMessage(
        `Request submitted successfully! Your Request ID is: ${data.requestId}. Status: ${data.status}`
      );
      setNewRequestUserId("");
      setNewRequestIssueDescription("");
    } catch (error: any) {
      console.error("Submission error:", error);
      setNewRequestSubmissionError(
        `Error submitting request: ${error.message}`
      );
    } finally {
      setIsSubmittingNewRequest(false);
    }
  };

  const handleViewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewedRequest(null);
    setViewRequestError("");
    setIsViewingRequest(true);
    setAdminResolutionError(""); // Clear admin errors when viewing
    setAdminResolutionSuccess("");

    if (!viewRequestId || !viewUserId) {
      setViewRequestError(
        "Request ID and User ID are required to view a request."
      );
      setIsViewingRequest(false);
      return;
    }

    const parsedRequestId = parseInt(viewRequestId);
    const parsedUserId = parseInt(viewUserId);

    if (isNaN(parsedRequestId) || isNaN(parsedUserId)) {
      setViewRequestError("Request ID and User ID must be valid numbers.");
      setIsViewingRequest(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${parsedRequestId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Request not found. Please check the ID.");
        }
        const errorData: { message?: string } = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(errorData.message || "Failed to fetch request.");
      }

      const data: AssistanceDTO = await response.json();
      // Basic client-side check: ensure the fetched request belongs to the provided userId
      if (data.userId !== parsedUserId) {
        throw new Error("Request ID does not match the provided User ID.");
      }
      setViewedRequest(data);
      // If admin mode is on and request is pending, pre-fill resolution message if any
      if (isAdminMode && data.status === "Pending") {
        setAdminResolutionMessage(data.resolutionMessage || "");
      }
    } catch (error: any) {
      console.error("View request error:", error);
      setViewRequestError(`Error viewing request: ${error.message}`);
    } finally {
      setIsViewingRequest(false);
    }
  };

  const handleAdminResolve = async () => {
    if (!viewedRequest || !adminResolutionMessage.trim()) {
      setAdminResolutionError("Resolution message cannot be empty.");
      return;
    }

    setIsResolving(true);
    setAdminResolutionError("");
    setAdminResolutionSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/${viewedRequest.requestId}/resolve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
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

      // Update the viewed request's status and message immediately after successful resolution
      const updatedRequest: AssistanceDTO = await response.json();
      setViewedRequest(updatedRequest); // Update local state with resolved data
      setAdminResolutionSuccess("Request resolved successfully!");
      setAdminResolutionMessage(""); // Clear resolution message input
    } catch (err: any) {
      console.error("Resolve error:", err);
      setAdminResolutionError(`Error resolving request: ${err.message}`);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="logo">TravelEase</div>
          {/* Admin Mode Toggle */}
          <div className="admin-toggle">
            <label htmlFor="adminModeToggle">Admin Mode:</label>
            <input
              type="checkbox"
              id="adminModeToggle"
              checked={isAdminMode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsAdminMode(e.target.checked)
              }
            />
          </div>
        </nav>
      </header>
      <main className="page-container">
        <div className="card">
          <h2 className="card-title">Assistance Request</h2>

          {/* Section 1: Submit New Request */}
          <section className="section-block">
            <h3>Submit a New Request</h3>
            <form onSubmit={handleNewRequestSubmit} className="form-group">
              <label htmlFor="newRequestUserId">User ID</label>
              <input
                type="text"
                id="newRequestUserId"
                placeholder="Enter your user ID (e.g., 123)"
                value={newRequestUserId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewRequestUserId(e.target.value)
                }
                required
                className="input-field"
              />

              <label htmlFor="newRequestIssueDescription">
                Issue Description
              </label>
              <textarea
                id="newRequestIssueDescription"
                placeholder="Describe your issue in detail"
                value={newRequestIssueDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewRequestIssueDescription(e.target.value)
                }
                rows={5}
                required
                className="textarea-field"
              ></textarea>

              <button
                type="submit"
                disabled={isSubmittingNewRequest}
                className="submit-button"
              >
                {isSubmittingNewRequest
                  ? "Submitting..."
                  : "Submit Assistance Request"}
              </button>

              {newRequestSubmissionMessage && (
                <p className="success-message">{newRequestSubmissionMessage}</p>
              )}
              {newRequestSubmissionError && (
                <p className="error-message">{newRequestSubmissionError}</p>
              )}
            </form>
          </section>

          {/* FAQ Section */}
          <section className="section-block faq-section">
            <h3>Common Questions & Quick Solutions</h3>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                onSelectIssue={handleFAQSelect}
              />
            ))}
          </section>

          {/* Section 2: View Existing Request */}
          <section className="section-block">
            <h3>View Existing Request</h3>
            <form onSubmit={handleViewRequest} className="form-group">
              <label htmlFor="viewRequestId">Request ID</label>
              <input
                type="text"
                id="viewRequestId"
                placeholder="Enter Request ID"
                value={viewRequestId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setViewRequestId(e.target.value)
                }
                required
                className="input-field"
              />
              <label htmlFor="viewUserId">Your User ID</label>
              <input
                type="text"
                id="viewUserId"
                placeholder="Enter your User ID"
                value={viewUserId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setViewUserId(e.target.value)
                }
                required
                className="input-field"
              />
              <button
                type="submit"
                disabled={isViewingRequest}
                className="submit-button"
              >
                {isViewingRequest ? "Loading..." : "View Request Details"}
              </button>
              {viewRequestError && (
                <p className="error-message">{viewRequestError}</p>
              )}
            </form>

            {viewedRequest && (
              <div className="request-details-display">
                <h4>Request ID: {viewedRequest.requestId}</h4>
                <p>
                  <strong>User ID:</strong> {viewedRequest.userId}
                </p>
                <p>
                  <strong>Issue Description:</strong>{" "}
                  {viewedRequest.issueDescription}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-${viewedRequest.status?.toLowerCase()}`}
                  >
                    {viewedRequest.status}
                  </span>
                </p>

                {viewedRequest.status === "Resolved" && (
                  <>
                    <p>
                      <strong>Resolved At:</strong>{" "}
                      {viewedRequest.resolutionTime
                        ? new Date(
                            viewedRequest.resolutionTime
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Admin Reply:</strong>{" "}
                      {viewedRequest.resolutionMessage ||
                        "No resolution message provided."}
                    </p>
                  </>
                )}

                {/* Admin Resolution Section (Conditional) */}
                {isAdminMode && viewedRequest.status === "Pending" && (
                  <div className="admin-resolution-section">
                    <h4>Admin Resolution</h4>
                    <label htmlFor="adminResolutionMessage">
                      Resolution Message:
                    </label>
                    <textarea
                      id="adminResolutionMessage"
                      value={adminResolutionMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setAdminResolutionMessage(e.target.value)
                      }
                      rows={4}
                      placeholder="Enter admin's resolution message"
                      className="textarea-field"
                    ></textarea>
                    <button
                      className="submit-button"
                      onClick={handleAdminResolve}
                      disabled={isResolving}
                    >
                      {isResolving ? "Resolving..." : "Resolve Request"}
                    </button>
                    {adminResolutionSuccess && (
                      <p className="success-message">
                        {adminResolutionSuccess}
                      </p>
                    )}
                    {adminResolutionError && (
                      <p className="error-message">{adminResolutionError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

// --- Main App Component ---
function App() {
  // In this single-page design, App just renders the main AssistancePage
  return <AssistancePage />;
}

export default App;
