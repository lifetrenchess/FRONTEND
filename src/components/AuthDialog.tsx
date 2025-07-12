
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
import { registerUser, loginUser, User, LoginRequest, getCurrentUser } from '@/lib/userApi';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role: string;
}

interface AuthDialogProps {
  children: React.ReactNode;
  onAuthSuccess?: (userData: UserData) => void;
}

const AuthDialog = ({ children, onAuthSuccess }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userContactNumber: ''
  });
  // Add state for specific field errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (isLogin) {
      if (!formData.userEmail || !formData.userPassword) {
        setMessage({ type: 'error', text: 'Email and password are required' });
        return false;
      }
    } else {
      if (formData.userPassword !== formData.confirmPassword) {
        errors['confirmPassword'] = 'Passwords do not match';
      }
      if (formData.userPassword.length < 8) {
        errors['userPassword'] = 'Password must be at least 8 characters';
      }
      // Check password complexity
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
      if (!passwordRegex.test(formData.userPassword)) {
        errors['userPassword'] = 'Password must contain uppercase, lowercase, digit, and special character (@#$%^&+=)';
      }
      if (!formData.userName || !formData.userEmail || !formData.userContactNumber) {
        setMessage({ type: 'error', text: 'All fields are required' });
        return false;
      }
      // Check contact number format (10-14 digits, starting with non-zero)
      const contactRegex = /^[1-9]\d{9,14}$/;
      if (!contactRegex.test(formData.userContactNumber)) {
        errors['userContactNumber'] = 'Contact number must be 10-14 digits starting with non-zero';
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: 'Please fix the errors above.' });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const userData: User = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
        userRole: 'USER',
        userContactNumber: formData.userContactNumber
      };
      await registerUser(userData);
      setMessage({ type: 'success', text: 'Registration successful! Please sign in.' });
      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          userName: '',
          userEmail: formData.userEmail, // keep email for convenience
          userPassword: '',
          confirmPassword: '',
          userContactNumber: ''
        });
        setMessage(null);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const loginData: LoginRequest = {
        userEmail: formData.userEmail,
        userPassword: formData.userPassword
      };
      const token = await loginUser(loginData);
      localStorage.setItem('token', token);
      
      // Add a small delay to ensure token is stored before making authenticated request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Fetch user profile after login to get role
      const user = await getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
        
        // Create currentUser object with role
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
          // Redirect to home page instead of dashboard
          navigate('/');
        }, 1500);
        
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        // Even if profile fetch fails, we can still proceed with basic login
        const currentUser = {
          fullName: formData.userEmail.split('@')[0], // Use email prefix as name
          email: formData.userEmail,
          isAuthenticated: true,
          role: 'USER' // Default role
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
      if (onAuthSuccess) onAuthSuccess(currentUser);
        
        setMessage({ type: 'success', text: 'Login successful! Welcome back!' });
        
      setTimeout(() => {
        setIsOpen(false);
          navigate('/');
        }, 1500);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      userName: '',
      userEmail: '',
      userPassword: '',
      confirmPassword: '',
      userContactNumber: ''
    });
    setMessage(null);
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
            {isLogin ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[80vh] overflow-y-auto px-2"
          style={{ minWidth: 320 }}
        >
          {!isLogin && (
            <>
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </>
          )}
          {!isLogin && fieldErrors.userName && (
            <div className="text-xs text-red-500">{fieldErrors.userName}</div>
          )}
          {!isLogin && (
            <>
              <Label htmlFor="userContactNumber">Contact Number</Label>
              <Input
                id="userContactNumber"
                name="userContactNumber"
                type="tel"
                value={formData.userContactNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter your contact number"
              />
            </>
          )}
          {!isLogin && fieldErrors.userContactNumber && (
            <div className="text-xs text-red-500">{fieldErrors.userContactNumber}</div>
          )}
          <Label htmlFor="userEmail">Email</Label>
          <Input
            id="userEmail"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
          <Label htmlFor="userPassword">Password</Label>
          <Input
            id="userPassword"
            name="userPassword"
            type="password"
            value={formData.userPassword}
            onChange={handleInputChange}
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="Enter your password"
          />
          {!isLogin && fieldErrors.userPassword && (
            <div className="text-xs text-red-500">{fieldErrors.userPassword}</div>
          )}
          {!isLogin && (
            <>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
            </>
          )}
          {!isLogin && fieldErrors.confirmPassword && (
            <div className="text-xs text-red-500">{fieldErrors.confirmPassword}</div>
          )}
          {message && (
            <div className={`flex items-center gap-2 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}
          <Button type="submit" className="w-full bg-[#01E8B2] text-white" disabled={isLoading}>
            {isLoading ? (isLogin ? 'Signing In...' : 'Registering...') : (isLogin ? 'Sign In' : 'Register')}
          </Button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-[#964734] hover:underline text-sm"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
