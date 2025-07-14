import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { loginUser, getCurrentUser, LoginRequest } from '@/lib/userApi';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role: string;
}

interface LoginDialogProps {
  children: React.ReactNode;
  onAuthSuccess?: (userData: UserData) => void;
}

const LoginDialog = ({ children, onAuthSuccess }: LoginDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.userEmail || !formData.userPassword) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return false;
    }
    return true;
  };

  const redirectBasedOnRole = (role: string) => {
    // Remove this function as we don't want to redirect to dashboard
    // Users will stay on homepage and use the navbar button to access dashboard
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const loginData: LoginRequest = {
        userEmail: formData.userEmail,
        userPassword: formData.userPassword
      };
      
      const token = await loginUser(loginData);
      
      // Store token with the correct key from API_CONFIG
      localStorage.setItem('token', token);
      
      // Fetch user profile after login to get role
      const user = await getCurrentUser();
      const currentUser = {
        fullName: user.userName,
        email: user.userEmail,
        isAuthenticated: true,
        role: user.userRole || 'USER'
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      if (onAuthSuccess) onAuthSuccess(currentUser);

      setMessage({ type: 'success', text: `Login successful! Welcome back, ${currentUser.fullName}!` });

      setTimeout(() => {
        setIsOpen(false);
        // Stay on homepage
      }, 1000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-palette-cream">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-palette-teal">
            <UserIcon className="w-5 h-5" />
            Sign In
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              name="userEmail"
              type="email"
              value={formData.userEmail}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="userPassword">Password</Label>
            <Input
              id="userPassword"
              name="userPassword"
              type="password"
              value={formData.userPassword}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#01E8B2] hover:bg-[#00d4a1] text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 