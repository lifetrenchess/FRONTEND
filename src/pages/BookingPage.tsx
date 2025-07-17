import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchPackageById, TravelPackageDto } from '@/lib/packagesApi';
import { createBooking } from '@/lib/bookingApi';
import { toast } from 'sonner';
import styles from '@/styles/BookingPage.module.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packageData, setPackageData] = useState<TravelPackageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelerNames, setTravelerNames] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPackageById(Number(id)).then((data) => {
        setPackageData(data);
        setLoading(false);
      }).catch(() => {
        setError('Failed to load package.');
        setLoading(false);
      });
    }
    // Set number of travelers from localStorage
    const stored = Number(localStorage.getItem('selectedGuests'));
    if (stored && stored > 0) {
      setNumTravelers(stored);
      setTravelerNames(Array(stored).fill(''));
    }
  }, [id]);

  const handleTravelerNameChange = (idx: number, value: string) => {
    setTravelerNames(prev => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (!/^[6-9]\d{9}$/.test(value)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || travelerNames.some(name => !name) || !email || !phoneNumber || !agreedToTerms) {
      alert('Please fill all required fields and agree to terms.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }
    setPhoneError('');
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0,0);
    if (selectedDate < today) {
      alert('Start date must be today or in the future.');
      return;
    }
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').userId || 1;
    const totalAmount = packageData ? packageData.price * numTravelers : 0;
    try {
      const bookingData = {
        userId: userId,
        packageId: Number(id),
        startDate: startDate,
        endDate: new Date(new Date(startDate).getTime() + (packageData?.duration || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'PENDING',
        adults: numTravelers,
        children: 0,
        infants: 0,
        contactFullName: travelerNames[0] || '',
        contactEmail: email || '',
        contactPhone: phoneNumber || '',
        travelerNames: travelerNames.join(', '),
        hasInsurance: hasInsurance || false,
        insurancePlan: null
      };

      console.log('Creating booking with data:', bookingData);
      const createdBooking = await createBooking(bookingData);
      console.log('Booking created successfully:', createdBooking);
      
      const state = {
        bookingId: createdBooking.bookingId,
        totalAmount,
        userId,
        packageData
      };

      if (hasInsurance) {
        navigate('/insurance', { state });
      } else {
        navigate('/booking-summary', { state });
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-palette-teal">Confirm Your Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
              <div>
                <Label>Number of Travelers</Label>
                <Input type="number" min={1} max={4} value={numTravelers} onChange={e => {
                  const n = Math.max(1, Math.min(4, Number(e.target.value)));
                  setNumTravelers(n);
                  setTravelerNames(Array(n).fill(''));
                }} required />
              </div>
              {Array.from({ length: numTravelers }).map((_, idx) => (
                <div key={idx}>
                  <Label>{`Traveler ${idx + 1} Name`}</Label>
                  <Input value={travelerNames[idx] || ''} onChange={e => handleTravelerNameChange(idx, e.target.value)} required />
                </div>
              ))}
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={phoneNumber} onChange={e => handlePhoneChange(e.target.value)} required maxLength={10} pattern="[6-9]{1}[0-9]{9}" />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="addInsurance" checked={hasInsurance} onCheckedChange={checked => setHasInsurance(!!checked)} />
                <Label htmlFor="addInsurance">Add Insurance</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="agreeTerms" checked={agreedToTerms} onCheckedChange={checked => setAgreedToTerms(!!checked)} />
                <Label htmlFor="agreeTerms">I agree to the terms and conditions</Label>
              </div>
              <Button type="submit" className="bg-palette-orange hover:bg-palette-teal text-white font-bold w-full">Proceed</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage; 