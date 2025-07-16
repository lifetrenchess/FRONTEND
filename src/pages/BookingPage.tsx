import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getApiUrl } from '@/lib/apiConfig';
import { fetchPackageById, TravelPackageDto } from '@/lib/packagesApi';
import styles from '@/styles/BookingPage.module.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packageData, setPackageData] = useState<TravelPackageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !fullName || !email || !phoneNumber || !agreedToTerms) {
      alert('Please fill all required fields and agree to terms.');
      return;
    }
    // Simulate booking creation and pass data to next page
    const bookingId = Math.floor(Math.random() * 1000000); // Replace with real booking creation
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').userId || 1;
    const totalAmount = packageData ? packageData.price * adults + (children * packageData.price * 0.5) : 0;
    const state = {
      bookingId,
      totalAmount,
      userId,
      packageData
    };
    if (hasInsurance) {
      navigate('/insurance', { state });
    } else {
      navigate('/booking-summary', { state });
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
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label>Adults</Label>
                  <Input type="number" min={1} value={adults} onChange={e => setAdults(Number(e.target.value))} required />
                </div>
                <div>
                  <Label>Children</Label>
                  <Input type="number" min={0} value={children} onChange={e => setChildren(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Infants</Label>
                  <Input type="number" min={0} value={infants} onChange={e => setInfants(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
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