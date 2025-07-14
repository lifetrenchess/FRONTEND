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
import InsuranceOptions from '@/components/InsuranceOptions';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { fetchPackageById, TravelPackageDto } from '@/lib/packagesApi';

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
  insurancePlan?: number;
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
  const [selectedInsurancePlan, setSelectedInsurancePlan] = useState<number | null>(null);
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

  useEffect(() => {
    if (packageData) {
      let currentPackagePrice = packageData.price * adults + packageData.price * children * 0.5 + 0 * infants;
      let currentInsuranceCost = 0;
      if (hasInsurance && selectedInsurancePlan) {
        const insurancePrices = { 1: 599, 2: 899, 3: 1000 };
        const planPrice = insurancePrices[selectedInsurancePlan as keyof typeof insurancePrices] || 0;
        currentInsuranceCost = planPrice * (adults + children);
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
  }, [adults, children, infants, hasInsurance, selectedInsurancePlan, packageData]);

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

  const handleTravelerNameChange = (index: number, name: string) => {
    setTravelerNames(prevNames => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleSubmitBooking = async () => {
    if (!startDate || !endDate || !agreedToTerms || fullName === '' || email === '' || phoneNumber === '' || adults === 0 || travelerNames.slice(0, adults + children).some(name => name.trim() === '')) {
      alert('Please fill all required fields, select dates, and agree to terms.');
      return;
    }

    if (hasInsurance && !selectedInsurancePlan) {
      alert('Please select an insurance plan or uncheck the insurance option.');
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
      insurancePlan: selectedInsurancePlan,
    };

    console.log('Booking Payload:', bookingPayload);

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
      console.log('Booking created:', createdBooking);

      // Navigate to payment page
      navigate('/payment', {
        state: {
          bookingId: createdBooking.bookingId,
          totalAmount: priceBreakdown.totalAmount,
          userId: currentUser.userId,
        },
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      // setIsSubmitting(false); // This line was not in the new_code, so it's removed.
    }
  };

  const QuantitySelector = ({ label, value, onChange, min = 0, max = Infinity }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className="w-8 h-8 p-0"
        >
          -
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className="w-8 h-8 p-0"
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Package Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span>Confirm & Pay</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Select Your Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date <= (startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travelers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Who's Traveling?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="md:col-span-2">
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
                    <h3 className="text-lg font-medium mb-4">Traveler Names</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Insurance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Enhance Your Trip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addInsurance"
                      checked={hasInsurance}
                      onCheckedChange={(checked) => {
                        setHasInsurance(checked as boolean);
                        if (!checked) {
                          setSelectedInsurancePlan(null);
                        } else if (!selectedInsurancePlan) {
                          setSelectedInsurancePlan(2); // Default to Medium package (ID: 2)
                        }
                      }}
                    />
                    <Label htmlFor="addInsurance" className="text-sm font-medium">
                      Add Travel Insurance
                    </Label>
                  </div>
                  
                  {hasInsurance && (
                    <InsuranceOptions
                      selectedPlan={selectedInsurancePlan}
                      onPlanSelect={setSelectedInsurancePlan}
                      travelers={adults + children}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    I have read and agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-palette-teal hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-palette-teal hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <img 
                    src={packageSummary.image} 
                    alt={packageSummary.title} 
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium">{packageSummary.title}</h3>
                    <p className="text-sm text-gray-600">{packageSummary.duration}</p>
                    <p className="text-sm text-gray-600">{packageSummary.selectedDates}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p><strong>Travelers:</strong> {adults} Adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}{infants > 0 ? `, ${infants} Infant${infants !== 1 ? 's' : ''}` : ''}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Package Price:</span>
                  <span>{formatIndianRupees(priceBreakdown.packagePrice)}</span>
                </div>
                {hasInsurance && (
                  <div className="flex justify-between">
                    <span>Travel Insurance:</span>
                    <span>{formatIndianRupees(priceBreakdown.travelInsurance)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & Fees:</span>
                  <span>{formatIndianRupees(priceBreakdown.taxesFees)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>{formatIndianRupees(priceBreakdown.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-palette-orange hover:bg-palette-orange/90"
              onClick={handleSubmitBooking}
              disabled={
                !startDate || !endDate || !agreedToTerms ||
                fullName === '' || email === '' || phoneNumber === '' ||
                adults === 0 ||
                travelerNames.slice(0, adults + children).some(name => name.trim() === '') ||
                (hasInsurance && !selectedInsurancePlan)
              }
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 