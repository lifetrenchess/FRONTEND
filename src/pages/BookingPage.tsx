import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getApiUrl } from '@/lib/apiConfig';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { fetchPackageById, TravelPackageDto } from '@/lib/packagesApi';
import styles from '@/styles/BookingPage.module.css';

interface TravelPackageSummary {
  image: string;
  title: string;
  duration: string;
  selectedDates: string;
}

interface PriceBreakdown {
  packagePrice: number;
  travelInsurance: number;
  taxesFees: number;
  totalAmount: number;
}

interface BookingDTO {
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
    contact: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    names: string[];
  };
  hasInsurance: boolean;
}

const mockPackage = {
  mainImage: 'https://via.placeholder.com/200x150',
  title: 'Mystical Bali Retreat',
  duration: 7,
  price: 1500.00,
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
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
  const [packageData, setPackageData] = useState<TravelPackageDto | null>(null);

  const [packageSummary, setPackageSummary] = useState<TravelPackageSummary>({
    image: '',
    title: '',
    duration: '',
    selectedDates: 'Please select dates',
  });

  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    packagePrice: 1500.00,
    travelInsurance: 0.00,
    taxesFees: 50.00,
    totalAmount: 1550.00,
  });

  // Add step indicator state
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    if (id) {
      fetchPackageById(Number(id)).then((data) => {
        if (data && data.packageId) {
          setPackageData(data);
          setPackageSummary((prev) => ({
            ...prev,
            image: data.mainImage || mockPackage.mainImage,
            title: data.title,
            duration: `${data.duration} Days`,
          }));
          setPriceBreakdown((prev) => ({
            ...prev,
            packagePrice: data.price,
            totalAmount: data.price + prev.travelInsurance + prev.taxesFees,
          }));
        } else {
          // Use mock data if no package found
          setPackageData(null);
          setPackageSummary((prev) => ({
            ...prev,
            image: mockPackage.mainImage,
            title: mockPackage.title,
            duration: `${mockPackage.duration} Days`,
          }));
          setPriceBreakdown((prev) => ({
            ...prev,
            packagePrice: mockPackage.price,
            totalAmount: mockPackage.price + prev.travelInsurance + prev.taxesFees,
          }));
        }
      }).catch(() => {
        // Use mock data if fetch fails
        setPackageData(null);
        setPackageSummary((prev) => ({
          ...prev,
          image: mockPackage.mainImage,
          title: mockPackage.title,
          duration: `${mockPackage.duration} Days`,
        }));
        setPriceBreakdown((prev) => ({
          ...prev,
          packagePrice: mockPackage.price,
          totalAmount: mockPackage.price + prev.travelInsurance + prev.taxesFees,
        }));
      });
    }
  }, [id]);

  // 1. Restore form data on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookingFormData');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.startDate) setStartDate(new Date(data.startDate));
      if (data.endDate) setEndDate(new Date(data.endDate));
      if (data.adults !== undefined) setAdults(data.adults);
      if (data.children !== undefined) setChildren(data.children);
      if (data.infants !== undefined) setInfants(data.infants);
      if (data.fullName !== undefined) setFullName(data.fullName);
      if (data.email !== undefined) setEmail(data.email);
      if (data.phoneNumber !== undefined) setPhoneNumber(data.phoneNumber);
      if (data.travelerNames !== undefined) setTravelerNames(data.travelerNames);
      if (data.hasInsurance !== undefined) setHasInsurance(data.hasInsurance);
      if (data.agreedToTerms !== undefined) setAgreedToTerms(data.agreedToTerms);
    }
  }, []);

  useEffect(() => {
    // Read guests from query param or localStorage
    const params = new URLSearchParams(location.search);
    const guestsParam = params.get('guests');
    let guests = 1;
    if (guestsParam) {
      guests = parseInt(guestsParam);
      localStorage.setItem('selectedGuests', guestsParam);
    } else {
      const stored = localStorage.getItem('selectedGuests');
      if (stored) guests = parseInt(stored);
    }
    setAdults(guests);
  }, []);

  useEffect(() => {
    if (packageData) {
      let currentPackagePrice = packageData.price * adults + packageData.price * children * 0.5 + 0 * infants;
      let currentInsuranceCost = 0;
      if (hasInsurance) {
        currentInsuranceCost = 1000; // Fixed insurance cost for now
      }
      let currentTaxesFees = 50;
      const newTotalAmount = currentPackagePrice + currentInsuranceCost + currentTaxesFees;
      setPriceBreakdown({
        packagePrice: currentPackagePrice,
        travelInsurance: currentInsuranceCost,
        taxesFees: currentTaxesFees,
        totalAmount: newTotalAmount,
      });
    }
  }, [adults, children, infants, hasInsurance, packageData]);

  useEffect(() => {
    if (startDate && endDate) {
      const startStr = format(startDate, 'MMM dd');
      const endStr = format(endDate, 'MMM dd, yyyy');
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

  // 1. When startDate or packageData.duration changes, auto-set endDate
  useEffect(() => {
    if (startDate && packageData?.duration) {
      const calculatedEnd = new Date(startDate);
      calculatedEnd.setDate(calculatedEnd.getDate() + packageData.duration - 1);
      setEndDate(calculatedEnd);
    }
  }, [startDate, packageData?.duration]);

  const handleTravelerNameChange = (index: number, name: string) => {
    setTravelerNames(prevNames => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  // 2. Save form data before navigating to insurance
  const handleSubmitBooking = async () => {
    if (!startDate || !agreedToTerms || fullName === '' || email === '' || phoneNumber === '' || adults === 0 || travelerNames.slice(0, adults + children).some(name => name.trim() === '')) {
      alert('Please fill all required fields, select dates, and agree to terms.');
      return;
    }
    // Get current user from authentication
    const currentUser = getCurrentUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      alert('Please log in to make a booking.');
      return;
    }
    const userId = currentUser.userId;
    const packageId = parseInt(id || '456');
    const bookingPayload: BookingDTO = {
      userId: userId,
      packageId: packageId,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
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
    try {
      const response = await fetch(getApiUrl('BOOKING_SERVICE', ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      const createdBooking = await response.json();
      localStorage.removeItem('bookingFormData');
      if (hasInsurance) {
        navigate('/insurance', {
          state: {
            bookingId: createdBooking.bookingId,
            totalAmount: priceBreakdown.totalAmount,
            userId: currentUser.userId,
          },
        });
      } else {
      navigate('/payment', {
        state: {
          bookingId: createdBooking.bookingId,
          totalAmount: priceBreakdown.totalAmount,
          userId: currentUser.userId,
        },
      });
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    }
  };

  const QuantitySelector = ({ label, value, onChange, min = 0, max = Infinity }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div className={styles.quantitySelector}>
      <Label className={styles.quantitySelectorLabel}>{label}</Label>
      <div className={styles.quantitySelectorButtons}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className={styles.quantityButton}
        >
          -
        </Button>
        <span className={styles.quantityValue}>{value}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className={styles.quantityButton}
        >
          +
        </Button>
      </div>
    </div>
  );

  // Add step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${step === s ? 'bg-palette-teal scale-110 shadow-lg' : 'bg-gray-300'}`}>{s}</div>
          {i < 2 && <div className={`w-12 h-1 ${step > s ? 'bg-palette-orange' : 'bg-gray-200'} transition-all duration-300`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepIndicator />
        {/* Animate form sections */}
        <div className={`transition-all duration-700 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}> {/* Step 1: Dates */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Calendar className={styles.cardTitleIcon} />
                <span>Select Your Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.grid}>
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          styles.dateButton,
                          !startDate && styles.dateButtonMuted
                        )}
                      >
                        <CalendarIcon className={styles.dateButtonIcon} />
                        {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className={styles.datePopoverContent}>
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="text"
                    value={endDate ? format(endDate, 'PPP') : ''}
                    readOnly
                    className={styles.endDateInput}
                    placeholder="End date will be auto-calculated"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="bg-palette-orange hover:bg-palette-teal text-white font-bold mt-6" onClick={() => setStep(2)}>Next</Button>
        </div>
        <div className={`transition-all duration-700 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}> {/* Step 2: Traveler Info */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Users className={styles.cardTitleIcon} />
                <span>Who's Traveling?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
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

              <Separator />

              <div>
                <h3 className={styles.sectionTitle}>Contact Details</h3>
                <div className={styles.grid}>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className={styles.colSpan2}>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              {(adults + children) > 0 && (
                <div>
                  <h3 className={styles.sectionTitle}>Traveler Names</h3>
                  <div className={styles.grid}>
                    {Array.from({ length: adults + children }).map((_, index) => (
                      <div key={index}>
                        <Label htmlFor={`traveler-name-${index}`}>Traveler {index + 1} Name</Label>
                        <Input
                          id={`traveler-name-${index}`}
                          value={travelerNames[index] || ''}
                          onChange={(e) => handleTravelerNameChange(index, e.target.value)}
                          placeholder={`Traveler ${index + 1} Full Name`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="bg-palette-orange hover:bg-palette-teal text-white font-bold" onClick={() => setStep(3)}>Next</Button>
          </div>
        </div>
        <div className={`transition-all duration-700 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}> {/* Step 3: Review & Confirm */}
          <Card className="shadow-xl bg-gradient-to-br from-palette-teal/10 to-palette-orange/10 border-0 animate-pop-in">
            <CardHeader>
              <CardTitle className="text-palette-teal">Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.flexSpaceX4}>
                <img 
                  src={packageSummary.image} 
                  alt={packageSummary.title} 
                  className={styles.packageImage}
                />
                <div>
                  <h3 className={styles.fontMedium}>{packageSummary.title}</h3>
                  <p className={styles.textSm}>{packageSummary.duration}</p>
                  <p className={styles.textSm}>{packageSummary.selectedDates}</p>
                </div>
              </div>
              
              <div className={styles.textSm}>
                <p><strong>Travelers:</strong> {adults} Adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}{infants > 0 ? `, ${infants} Infant${infants !== 1 ? 's' : ''}` : ''}</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button className="bg-palette-orange hover:bg-palette-teal text-white font-bold" onClick={handleSubmitBooking}>Confirm Booking</Button>
          </div>
        </div>
        <style>{`
          .animate-pop-in { animation: pop-in 0.6s cubic-bezier(.23,1.02,.57,1.01); }
          @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          input:focus, select:focus, textarea:focus { outline: 2px solid #1B9AAA; box-shadow: 0 0 0 2px #FF8800; transition: box-shadow 0.2s; }
        `}</style>
      </div>
    </div>
  );
};

export default BookingPage; 