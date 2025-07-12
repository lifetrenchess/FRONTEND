// src/App.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './styles/BookingPage.module.css';
import QuantitySelector from './components/QuantitySelector';
import type { BookingDTO, TravelPackageSummary, PriceBreakdown } from './types.ts';

// --- IMPORT THE REAL PAYMENT PAGE COMPONENT ---
// Ensure src/pages/PaymentPage.tsx exists and contains the detailed PaymentPage component
import PaymentPage from './components/PaymentPage.tsx';

// --- Placeholder Components for Redirection ---
// This InsurancePage placeholder now correctly uses useNavigate
const InsurancePage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleProceedToPayment = () => {
    alert('Proceeding to Payment from Insurance Page!');
    // In a real scenario, you might pass booking details here from the insurance page
    // For now, we just navigate to the payment page
    navigate('/payment-page');
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f8ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ color: '#007bff', fontSize: '2em' }}>Welcome to the Insurance Page!</h2>
      <p style={{ fontSize: '1.1em', color: '#555', maxWidth: '600px', margin: '15px auto' }}>This is where your friend's insurance module UI would be. You can proceed to payment from here.</p>
      <button
        onClick={handleProceedToPayment} // Call the new handler
        style={{
          padding: '12px 25px',
          fontSize: '1em',
          backgroundColor: '#28a745', // Green button
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px',
          boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)'
        }}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

// NEW: Add a simple placeholder for the Confirmation Page
const ConfirmationPage: React.FC = () => (
  <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#e9f7ef', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <h2 style={{ color: '#28a745', fontSize: '2.5em', marginBottom: '15px' }}>Booking Confirmed! 🎉</h2>
    <p style={{ fontSize: '1.2em', color: '#333', maxWidth: '700px', margin: '0 auto 30px auto' }}>
      Thank you for your payment. Your booking has been successfully processed.
      A confirmation email with your detailed itinerary and e-vouchers has been sent to your registered email address.
    </p>
    <button
      onClick={() => alert('Viewing your bookings!')}
      style={{
        padding: '15px 30px',
        fontSize: '1.1em',
        backgroundColor: '#007bff', // Blue button
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)'
      }}
    >
      View My Bookings
    </button>
  </div>
);
// --- END Placeholder Components ---


// This component contains the content of your Booking Page.
// It's good practice to move this to src/pages/BookingPage.tsx
// For now, it remains here as per your provided file.
const BookingPageContent: React.FC = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [travelerNames, setTravelerNames] = useState<string[]>(['']);
  const [hasInsurance, setHasInsurance] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const [packageSummary, setPackageSummary] = useState<TravelPackageSummary>({
    image: 'https://via.placeholder.com/200x150',
    title: 'Mystical Bali Retreat',
    duration: '7 Days / 6 Nights',
    selectedDates: 'Please select dates',
  });

  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    packagePrice: 1500.00,
    travelInsurance: 0.00,
    taxesFees: 50.00,
    totalAmount: 1550.00,
  });

  // Helper function for currency formatting
  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const basePricePerAdult = 1500;
    const basePricePerChild = 750;
    const basePricePerInfant = 0;

    let currentPackagePrice = (adults * basePricePerAdult) + (children * basePricePerChild) + (infants * basePricePerInfant);
    let currentInsuranceCost = hasInsurance ? (25 * (adults + children)) : 0;
    let currentTaxesFees = 50;

    const newTotalAmount = currentPackagePrice + currentInsuranceCost + currentTaxesFees;

    setPriceBreakdown({
      packagePrice: currentPackagePrice,
      travelInsurance: currentInsuranceCost,
      taxesFees: currentTaxesFees,
      totalAmount: newTotalAmount,
    });
  }, [adults, children, infants, hasInsurance]);

  useEffect(() => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setPackageSummary((prev) => ({
        ...prev,
        selectedDates: `${startStr} - ${endStr}`,
      }));
    } else {
      setPackageSummary((prev) => ({
        ...prev,
        selectedDates: 'Please select dates',
      }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const totalTravelers = adults + children;
    setTravelerNames(prevNames => {
      const newNames = Array(totalTravelers).fill('').map((_, i) => prevNames[i] || '');
      return newNames;
    });
  }, [adults, children]);

  const handleTravelerNameChange = (index: number, name: string) => {
    setTravelerNames(prevNames => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmitBooking = async () => {
    if (!startDate || !endDate || !agreedToTerms || fullName === '' || email === '' || phoneNumber === '' || adults === 0 || travelerNames.slice(0, adults + children).some(name => name.trim() === '')) {
      alert('Please fill all required fields, select dates, and agree to terms.');
      return;
    }

    const userId = 123; // This userId is hardcoded for now, would typically come from authentication
    const packageId = 456;

    const bookingPayload: BookingDTO = {
      userId: userId,
      packageId: packageId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'PENDING',
      travelers: {
        adults: adults,
        children: children,
        infants: infants,
        contact: {
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
        },
        names: travelerNames.filter(name => name.trim() !== ''),
      },
      hasInsurance: hasInsurance,
    };

    console.log('Booking Payload:', bookingPayload);

    try {
      const response = await fetch('http://localhost:9003/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_JWT_TOKEN`
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
      }

      const bookingConfirmation = await response.json();
      console.log('Booking created:', bookingConfirmation);
      alert('Booking initiated successfully!');

      // --- Conditional Redirection Logic - NOW PASSING userId ---
      if (hasInsurance) {
        navigate('/insurance-page', {
          state: {
            bookingId: bookingConfirmation.bookingId,
            totalAmount: priceBreakdown.totalAmount,
            userId: userId // <--- userId is now passed here
          }
        });
      } else {
        navigate('/payment-page', {
          state: {
            bookingId: bookingConfirmation.bookingId,
            totalAmount: priceBreakdown.totalAmount,
            userId: userId // <--- userId is now passed here
          }
        });
      }

    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(`Failed to initiate booking. Please try again. Error: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bookingPage}>
        <header className={styles.header}>
          <h1>Confirm Your Booking</h1>
          <div className={styles.progressBar}>
            <span className={`${styles.progressStep} ${styles.active}`}>Package Details</span>
            <span className={styles.progressStep}>Confirm & Pay</span>
            <span className={styles.progressStep}>Confirmation</span>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <section className={styles.section}>
              <h2>Select Your Dates</h2>
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange // Corrected: removed the "se" typo here
                  inline
                  minDate={new Date()}
                  monthsShown={2}
                  calendarClassName={styles.customCalendar}
                  dayClassName={() => styles.customDay}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2>Who's Traveling?</h2>
              <QuantitySelector
                label="Adults (12+)"
                value={adults}
                onChange={setAdults}
                min={1}
              />
              <QuantitySelector
                label="Children (2-11)"
                value={children}
                onChange={setChildren}
              />
              <QuantitySelector
                label="Infants (under 2)"
                value={infants}
                onChange={setInfants}
              />

              <h3 style={{ marginTop: '25px', marginBottom: '15px', color: '#444' }}>Contact Details</h3>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {(adults + children) > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#444' }}>Traveler Names</h3>
                  {Array.from({ length: adults + children }).map((_, index) => (
                    <div className={styles.formGroup} key={index}>
                      <label htmlFor={`traveler-name-${index}`}>Traveler {index + 1} Name</label>
                      <input
                        type="text"
                        id={`traveler-name-${index}`}
                        value={travelerNames[index] || ''}
                        onChange={(e) => handleTravelerNameChange(index, e.target.value)}
                        placeholder={`Traveler ${index + 1} Full Name`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.section}>
              <h2>Enhance Your Trip</h2>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="addInsurance"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                />
                <label htmlFor="addInsurance">
                  Add Travel Insurance <span style={{ fontSize: '0.85em', color: '#777' }}>(Comprehensive coverage + {formatIndianRupees(priceBreakdown.travelInsurance)})</span>
                </label>
              </div>
            </section>

            <div className={`${styles.checkboxGroup} ${styles.termsCheckbox}`}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeTerms">
                I have read and agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </label>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <h2>Booking Summary</h2>
            <div className={styles.packageSummary}>
              <img src={packageSummary.image} alt={packageSummary.title} />
              <h3>{packageSummary.title}</h3>
              <div className={styles.summaryDetail}>
                <span>Duration:</span>
                <span>{packageSummary.duration}</span>
              </div>
              <div className={styles.summaryDetail}>
                <span>Selected Dates:</span>
                <span>{packageSummary.selectedDates}</span>
              </div>
              <div className={styles.summaryDetail}>
                <span>Travelers:</span>
                <span>{adults} Adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}{infants > 0 ? `, ${infants} Infant${infants !== 1 ? 's' : ''}` : ''}</span>
              </div>
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceItem}>
                <span>Package Price:</span>
                <span>{formatIndianRupees(priceBreakdown.packagePrice)}</span>
              </div>
              {hasInsurance && (
                <div className={styles.priceItem}>
                  <span>Travel Insurance:</span>
                  <span>{formatIndianRupees(priceBreakdown.travelInsurance)}</span>
                </div>
              )}
              <div className={styles.priceItem}>
                <span>Taxes & Fees:</span>
                <span>{formatIndianRupees(priceBreakdown.taxesFees)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
              <div className={`${styles.priceItem} ${styles.total}`}>
                <span>Total Amount:</span>
                <span>{formatIndianRupees(priceBreakdown.totalAmount)}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.primaryButton}
            onClick={handleSubmitBooking}
            disabled={
              !startDate || !endDate || !agreedToTerms ||
              fullName === '' || email === '' || phoneNumber === '' ||
              adults === 0 ||
              travelerNames.slice(0, adults + children).some(name => name.trim() === '')
            }
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<BookingPageContent />} />
            <Route path="/insurance-page" element={<InsurancePage />} />
            <Route path="/payment-page" element={<PaymentPage />} />
            {/* NEW: Route for the Confirmation Page */}
            <Route path="/confirmation-page" element={<ConfirmationPage />} />
            {/* Add more routes here as your app grows */}
        </Routes>
    );
}

export default App;