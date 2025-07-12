import React, { useState, useEffect } from 'react';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestDashboard = () => {
  const [userRole, setUserRole] = useState<string>('Unknown');
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string>('Unknown');
  const navigate = useNavigate();

  useEffect(() => {
    // Check user role from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUserRole(userData.role || 'USER');
    }
    
    // Test API Gateway status
    testGatewayStatus();
  }, []);

  const testGatewayStatus = async () => {
    try {
      const response = await fetch('http://localhost:9999/actuator/health', { 
        method: 'GET',
        mode: 'cors'
      });
      if (response.ok) {
        setGatewayStatus('Running');
      } else {
        setGatewayStatus('Error');
      }
    } catch (error) {
      setGatewayStatus('Not Running');
    }
  };

  const testPackageFetch = async () => {
    setLoading(true);
    try {
      console.log('Testing package fetch through API Gateway...');
      const data = await fetchAllPackages();
      console.log('Package fetch result:', data);
      setPackages(data);
    } catch (error) {
      console.error('Package fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectGatewayCall = async () => {
    try {
      console.log('Testing direct API Gateway call...');
      const response = await fetch('http://localhost:9999/api/packages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Direct gateway call successful:', data);
        alert('✅ API Gateway is working! Packages found: ' + (data.length || 0));
      } else {
        console.error('Gateway call failed:', response.status);
        alert('❌ API Gateway call failed: ' + response.status);
      }
    } catch (error) {
      console.error('Direct gateway call error:', error);
      alert('❌ API Gateway not accessible: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>API Gateway Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  gatewayStatus === 'Running' ? 'bg-green-100 text-green-800' :
                  gatewayStatus === 'Error' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gatewayStatus}
                </span>
              </p>
              <p><strong>Current Role:</strong> {userRole}</p>
              <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Not found'}</p>
              <p><strong>User Data:</strong> {localStorage.getItem('currentUser') ? 'Present' : 'Not found'}</p>
            </div>
            <div>
              <button 
                onClick={testGatewayStatus}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Refresh Gateway Status
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Gateway Testing</h2>
          <div className="space-y-4">
            <button 
              onClick={testDirectGatewayCall}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Direct Gateway Call
            </button>
            
            <button 
              onClick={testPackageFetch}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test Package Fetch'}
            </button>
          </div>
          
          {packages.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Packages Found: {packages.length}</h3>
              <div className="space-y-2">
                {packages.slice(0, 3).map((pkg) => (
                  <div key={pkg.packageId} className="border p-3 rounded">
                    <p><strong>{pkg.title}</strong></p>
                    <p className="text-sm text-gray-600">{pkg.destination} - ₹{pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Service URLs</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Eureka Server:</strong> <a href="http://localhost:8761" target="_blank" className="text-blue-600 hover:underline">http://localhost:8761</a></p>
            <p><strong>API Gateway:</strong> <a href="http://localhost:9999" target="_blank" className="text-blue-600 hover:underline">http://localhost:9999</a></p>
            <p><strong>Package Service (Direct):</strong> <a href="http://localhost:9002/api/packages" target="_blank" className="text-blue-600 hover:underline">http://localhost:9002/api/packages</a></p>
            <p><strong>User Service (Direct):</strong> <a href="http://localhost:9001/api/users" target="_blank" className="text-blue-600 hover:underline">http://localhost:9001/api/users</a></p>
            <p><strong>Frontend:</strong> <a href="http://localhost:5173" target="_blank" className="text-blue-600 hover:underline">http://localhost:5173</a></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Go to User Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/admin'}
              className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Go to Admin Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/agent'}
              className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Go to Agent Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Go to Homepage
            </button>
          </div>
        </div>

        {/* Agent Dashboard Test Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Agent Dashboard Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Agent Login Test</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Test agent authentication and dashboard access
                </p>
                <Button 
                  onClick={() => {
                    // Simulate agent login
                    const agentUser = {
                      fullName: "Test Agent",
                      email: "agent@test.com",
                      isAuthenticated: true,
                      role: "AGENT"
                    };
                    localStorage.setItem('currentUser', JSON.stringify(agentUser));
                    window.location.reload();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Login as Agent
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Agent Dashboard Access</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Navigate to agent dashboard with package management
                </p>
                <Button 
                  onClick={() => navigate('/agent')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Agent Dashboard
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Agent Package Management Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ View all travel packages with filtering</li>
                <li>✅ Add new packages with full details</li>
                <li>✅ Edit existing package information</li>
                <li>✅ Delete packages with confirmation</li>
                <li>✅ Manage package status (Active/Inactive/Draft)</li>
                <li>✅ Set available seats and pricing</li>
                <li>✅ Include services and descriptions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestDashboard; 