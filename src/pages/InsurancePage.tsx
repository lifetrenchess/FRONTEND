import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, CheckCircle, ArrowLeft, Star, Users, Plane, Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { fetchInsurancePackages, selectInsuranceForBooking, InsurancePlan } from '@/lib/insuranceApi';
import { getCurrentUserFromStorage } from '@/lib/auth';
import styles from '@/styles/InsurancePage.module.css';

const InsurancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId, packageData } = (location.state || {}) as { 
    bookingId: number; 
    totalAmount: number; 
    userId: number; 
    packageData?: any;
  };

  // If bookingId or userId is missing, redirect to booking page
  useEffect(() => {
    if (!bookingId || !userId) {
      navigate('/');
    }
  }, [bookingId, userId, navigate]);

  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch insurance packages from backend on component mount
  useEffect(() => {
    const loadInsurancePackages = async () => {
      try {
        setLoading(true);
        const packages = await fetchInsurancePackages();
        setInsurancePlans(packages);
        setError(null);
      } catch (err) {
        console.error('Failed to load insurance packages:', err);
        setError('Failed to load insurance packages. Please try again.');
        toast.error('Failed to load insurance packages');
      } finally {
        setLoading(false);
      }
    };

    loadInsurancePackages();
  }, []);

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleProceedToSummary = async () => {
    if (!selectedPlan) {
      toast.error('Please select an insurance plan');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    try {
      const insuranceSelection = await selectInsuranceForBooking(
        selectedPlan,
        userId,
        bookingId
      );
      toast.success('Insurance plan selected successfully!');
      navigate('/booking-summary', {
        state: {
          bookingId: bookingId,
          totalAmount: totalAmount + (insurancePlans.find(p => p.insuranceId === selectedPlan)?.price || 0),
          userId: userId,
          packageData: packageData,
          insurance: {
            planId: selectedPlan,
            planName: insurancePlans.find(p => p.insuranceId === selectedPlan)?.packageType,
            price: insurancePlans.find(p => p.insuranceId === selectedPlan)?.price,
            insuranceId: insuranceSelection.insuranceId
          }
        }
      });
    } catch (error) {
      console.error('Failed to select insurance:', error);
      toast.error('Failed to select insurance plan. Please try again.');
    }
  };

  const handleSkipInsurance = () => {
    navigate('/booking-summary', {
      state: {
        bookingId: bookingId,
        totalAmount: totalAmount,
        userId: userId,
        packageData: packageData
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.textCenter}>
          <Loader2 className={styles.loader} />
          <p className={styles.loadingText}>Loading insurance packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.textCenter}>
          <Shield className={styles.shieldIcon} />
          <h2 className={styles.failedTitle}>Failed to Load Insurance</h2>
          <p className={styles.failedMessage}>{error}</p>
          <Button onClick={() => window.location.reload()} className={styles.tryAgainButton}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insurancePageContainer}>
      <div className={styles.maxWidthContainer}>
        {/* Header */}
        <div className={styles.header}>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.arrowLeft} />
            Back to Booking
          </Button>
          <h1 className={styles.travelInsuranceTitle}>Travel Insurance</h1>
          <p className={styles.travelInsuranceDescription}>Protect your journey with comprehensive travel insurance coverage</p>
        </div>

        <div className={styles.gridContainer}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Insurance Plans */}
            <div className={styles.insurancePlans}>
              {insurancePlans.map((plan) => (
                <Card 
                  key={plan.insuranceId} 
                  className={`${styles.insuranceCard} ${selectedPlan === plan.insuranceId ? styles.selectedPlan : ''} ${plan.packageType === 'Medium' ? styles.recommendedPlan : ''}`}
                  onClick={() => setSelectedPlan(plan.insuranceId)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader>
                    <div className={styles.cardHeaderContent}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name="insurancePlan"
                          checked={selectedPlan === plan.insuranceId}
                          onChange={() => setSelectedPlan(plan.insuranceId)}
                          style={{ marginRight: 8 }}
                        />
                        <CardTitle className={styles.cardTitle}>
                          <Shield className={styles.shieldIcon} />
                          <span>{plan.packageType} Coverage</span>
                          {plan.packageType === 'Medium' && (
                            <span className={styles.recommendedBadge}>
                              Recommended
                            </span>
                          )}
                        </CardTitle>
                      </div>
                      <div className={styles.priceContainer}>
                        <div className={styles.price}>
                          {formatIndianRupees(plan.price)}
                        </div>
                        <div className={styles.pricePerPerson}>per person</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={styles.cardContent}>
                      {/* Provider Info */}
                      <div className={styles.providerInfo}>
                        <Shield className={styles.shieldIcon} />
                        <span>Provider: {plan.provider}</span>
                      </div>
                      
                      {/* Coverage Summary */}
                      <div className={styles.coverageSummary}>
                        <h4 className={styles.coverageSummaryTitle}>Coverage Summary</h4>
                        <div className={styles.coverageSummaryDetails}>
                          <p className={styles.coverageSummaryText}>{plan.coverageDetails}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Terms and Conditions */}
            <Card className={styles.termsCard}>
              <CardContent className={styles.termsCardContent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Checkbox
                    id="agreeTerms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className={styles.termsLabel} style={{ marginBottom: 0 }}>
                    I have read and agree to the{' '}
                    <a href="/insurance-terms" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
                      Insurance Terms & Conditions
                    </a>{' '}
                    and understand that this insurance coverage is provided by our trusted insurance partner.
                  </Label>
                  <Button
                    className={styles.continueButton}
                    onClick={handleProceedToSummary}
                    disabled={!selectedPlan || !agreedToTerms}
                    style={{ marginLeft: 'auto', minWidth: 180 }}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Why Insurance */}
            <Card className={styles.whyInsuranceCard}>
              <CardHeader>
                <CardTitle className={styles.whyInsuranceTitle}>
                  <Shield className={styles.shieldIcon} />
                  <span>Why Travel Insurance?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.whyInsuranceContent}>
                <div className={styles.whyInsuranceItem}>
                  <Heart className={styles.whyInsuranceIcon} />
                  <div>
                    <h4 className={styles.whyInsuranceSubtitle}>Medical Protection</h4>
                    <p className={styles.whyInsuranceText}>Coverage for unexpected medical expenses abroad</p>
                  </div>
                </div>
                <div className={styles.whyInsuranceItem}>
                  <Plane className={styles.whyInsuranceIcon} />
                  <div>
                    <h4 className={styles.whyInsuranceSubtitle}>Trip Protection</h4>
                    <p className={styles.whyInsuranceText}>Coverage for trip cancellation and delays</p>
                  </div>
                </div>
                <div className={styles.whyInsuranceItem}>
                  <Users className={styles.whyInsuranceIcon} />
                  <div>
                    <h4 className={styles.whyInsuranceSubtitle}>24/7 Support</h4>
                    <p className={styles.whyInsuranceText}>Round-the-clock emergency assistance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className={styles.summaryCard}>
              <CardHeader>
                <CardTitle className={styles.summaryTitle}>Insurance Summary</CardTitle>
              </CardHeader>
              <CardContent className={styles.summaryContent}>
                <div className={styles.summaryItem}>
                  <span>Booking Amount:</span>
                  <span>{formatIndianRupees(totalAmount)}</span>
                </div>
                {selectedPlan && (
                  <>
                    <div className={styles.summaryItem}>
                      <span>Insurance:</span>
                      <span>{formatIndianRupees(insurancePlans.find(p => p.insuranceId === selectedPlan)?.price || 0)}</span>
                    </div>
                    <Separator className={styles.summarySeparator} />
                    <div className={styles.summaryTotal}>
                      <span>Total:</span>
                      <span>{formatIndianRupees(totalAmount + (insurancePlans.find(p => p.insuranceId === selectedPlan)?.price || 0))}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button
                className={styles.proceedButton}
                onClick={handleProceedToSummary}
                disabled={!selectedPlan || !agreedToTerms}
              >
                Continue to Payment
              </Button>
              <Button
                variant="outline"
                className={styles.skipButton}
                onClick={handleSkipInsurance}
              >
                Skip Insurance
              </Button>
            </div>

            {/* Trust Indicators */}
            <Card className={styles.trustIndicatorsCard}>
              <CardContent className={styles.trustIndicatorsContent}>
                <div className={styles.trustIndicatorsTextCenter}>
                  <div className={styles.trustIndicatorsStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={styles.trustIndicatorsStar} />
                    ))}
                  </div>
                  <p className={styles.trustIndicatorsText}>
                    Trusted by travelers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage; 