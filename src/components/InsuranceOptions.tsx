import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  coverage: string[];
  recommended?: boolean;
}

interface InsuranceOptionsProps {
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
  travelers: number;
}

const InsuranceOptions: React.FC<InsuranceOptionsProps> = ({
  selectedPlan,
  onPlanSelect,
  travelers
}) => {
  const insurancePlans: InsurancePlan[] = [
    {
      id: 'basic',
      name: 'Basic Coverage',
      description: 'Essential travel protection for peace of mind',
      price: 15,
      coverage: [
        'Trip cancellation up to $1,000',
        'Medical expenses up to $10,000',
        'Baggage loss up to $500',
        'Flight delay coverage'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Protection',
      description: 'Comprehensive coverage for most travelers',
      price: 25,
      coverage: [
        'Trip cancellation up to $2,500',
        'Medical expenses up to $25,000',
        'Baggage loss up to $1,000',
        'Flight delay and missed connection',
        'Emergency medical evacuation',
        '24/7 travel assistance'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      description: 'Maximum protection for worry-free travel',
      price: 40,
      coverage: [
        'Trip cancellation up to $5,000',
        'Medical expenses up to $50,000',
        'Baggage loss up to $2,000',
        'Flight delay and missed connection',
        'Emergency medical evacuation',
        '24/7 travel assistance',
        'Rental car damage',
        'Adventure sports coverage',
        'Cancel for any reason (up to 75%)'
      ]
    }
  ];

  const calculateTotalPrice = (planId: string) => {
    const plan = insurancePlans.find(p => p.id === planId);
    return plan ? plan.price * travelers : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Travel Insurance Options</h3>
      </div>
      
      <RadioGroup value={selectedPlan} onValueChange={onPlanSelect} className="space-y-4">
        {insurancePlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPlanSelect(plan.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <div>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <span>{plan.name}</span>
                      {plan.recommended && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ${plan.price}/traveler
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ${calculateTotalPrice(plan.id)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Coverage includes:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.coverage.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
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