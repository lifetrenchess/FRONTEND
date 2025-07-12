import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Globe, 
  Plane, 
  Hotel, 
  Utensils,
  Save,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface TravelPreferencesProps {
  user: UserData | null;
}

const TravelPreferences = ({ user }: TravelPreferencesProps) => {
  const [preferences, setPreferences] = useState({
    // Budget Preferences
    budgetRange: '2000-5000',
    currency: 'USD',
    
    // Travel Style
    travelStyle: 'adventure',
    accommodationType: 'hotel',
    mealPreference: 'local',
    
    // Destinations
    preferredRegions: ['Europe', 'Asia', 'North America'],
    avoidRegions: ['Middle East'],
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: true,
    destinationAlerts: true,
    
    // Accessibility
    accessibilityNeeds: false,
    dietaryRestrictions: 'none',
    
    // Group Size
    preferredGroupSize: '2-4',
    soloTravel: false
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const regions = [
    'Europe', 'Asia', 'North America', 'South America', 
    'Africa', 'Oceania', 'Middle East', 'Caribbean'
  ];

  const travelStyles = [
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { id: 'cultural', label: 'Cultural', icon: '🏛️' },
    { id: 'luxury', label: 'Luxury', icon: '💎' },
    { id: 'budget', label: 'Budget', icon: '💰' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Preferences</h1>
          <p className="text-gray-600">Customize your travel experience and preferences</p>
        </div>
        <Button className="bg-palette-teal hover:bg-palette-teal/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget & Financial Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-palette-teal" />
              <span>Budget & Financial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Budget Range (USD)</Label>
              <select 
                value={preferences.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:border-palette-teal focus:outline-none"
              >
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="2000-5000">$2,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000+">$10,000+</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <select 
                value={preferences.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:border-palette-teal focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Travel Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="w-5 h-5 text-palette-orange" />
              <span>Travel Style</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Travel Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleInputChange('travelStyle', style.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      preferences.travelStyle === style.id
                        ? 'border-palette-teal bg-palette-teal/10 text-palette-teal'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg">{style.icon}</div>
                    <div className="text-sm font-medium">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Accommodation Type</Label>
              <select 
                value={preferences.accommodationType}
                onChange={(e) => handleInputChange('accommodationType', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:border-palette-teal focus:outline-none"
              >
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="hostel">Hostel</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Destination Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-palette-peach" />
              <span>Destination Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Regions</Label>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((region) => (
                  <label key={region} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.preferredRegions.includes(region)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences(prev => ({
                            ...prev,
                            preferredRegions: [...prev.preferredRegions, region]
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            preferredRegions: prev.preferredRegions.filter(r => r !== region)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-palette-teal focus:ring-palette-teal"
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group & Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-palette-teal" />
              <span>Group & Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Group Size</Label>
              <select 
                value={preferences.preferredGroupSize}
                onChange={(e) => handleInputChange('preferredGroupSize', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:border-palette-teal focus:outline-none"
              >
                <option value="solo">Solo Travel</option>
                <option value="2-4">2-4 People</option>
                <option value="5-8">5-8 People</option>
                <option value="9+">9+ People</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Dietary Restrictions</Label>
              <select 
                value={preferences.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:border-palette-teal focus:outline-none"
              >
                <option value="none">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Accessibility Needs</Label>
                <p className="text-sm text-gray-500">Wheelchair accessible accommodations</p>
              </div>
              <Switch
                checked={preferences.accessibilityNeeds}
                onCheckedChange={(checked) => handleSwitchChange('accessibilityNeeds', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-palette-orange" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified of price drops</p>
                </div>
                <Switch
                  checked={preferences.priceAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('priceAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Destination Alerts</Label>
                  <p className="text-sm text-gray-500">New deals for preferred destinations</p>
                </div>
                <Switch
                  checked={preferences.destinationAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('destinationAlerts', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelPreferences; 