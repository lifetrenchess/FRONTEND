import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchInsurancePackages, InsurancePlan } from '@/lib/insuranceApi';

interface InsuranceOptionsProps {
  selectedPlan: number | null;
  onPlanSelect: (planId: number) => void;
  travelers: number;
}

const InsuranceOptions: React.FC<InsuranceOptionsProps> = ({
  selectedPlan,
  onPlanSelect,
  travelers
}) => {
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch insurance packages from backend
  useEffect(() => {
    const loadInsurancePackages = async () => {
      try {
        setLoading(true);
        const packages = await fetchInsurancePackages();
        setInsurancePlans(packages);
        setError(null);
      } catch (err) {
        console.error('Failed to load insurance packages:', err);
        setError('Failed to load insurance packages');
      } finally {
        setLoading(false);
      }
    };

    loadInsurancePackages();
  }, []);

  const calculateTotalPrice = (planId: number) => {
    const plan = insurancePlans.find(p => p.insuranceId === planId);
    return plan ? plan.price * travelers : 0;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Travel Insurance Options</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading insurance options...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Travel Insurance Options</h3>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Travel Insurance Options</h3>
      </div>
      
      <RadioGroup 
        value={selectedPlan?.toString() || ''} 
        onValueChange={(value) => onPlanSelect(parseInt(value))} 
        className="space-y-4"
      >
        {insurancePlans.map((plan) => (
          <Card 
            key={plan.insuranceId} 
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.insuranceId 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPlanSelect(plan.insuranceId)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={plan.insuranceId.toString()} id={plan.insuranceId.toString()} />
                  <div>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <span>{plan.packageType} Coverage</span>
                      {plan.packageType === 'Medium' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{plan.coverageDetails}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹{plan.price}/traveler
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ₹{calculateTotalPrice(plan.insuranceId)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Provider: {plan.provider}</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 leading-relaxed">{plan.coverageDetails}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      {selectedPlan && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Important Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  Insurance coverage begins from the date of purchase. Please review the full terms and conditions 
                  before making your selection. Claims must be filed within 30 days of the incident.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsuranceOptions; 