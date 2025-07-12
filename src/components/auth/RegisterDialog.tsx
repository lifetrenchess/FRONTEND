import React, { useState } from 'react';
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
import { registerUser, User } from '@/lib/userApi';

interface RegisterDialogProps {
  children: React.ReactNode;
  onRegisterSuccess?: () => void;
}

const RegisterDialog = ({ children, onRegisterSuccess }: RegisterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userContactNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Password validation
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
    
    // Contact number validation
    const contactRegex = /^[1-9]\d{9,14}$/;
    if (!contactRegex.test(formData.userContactNumber)) {
      errors['userContactNumber'] = 'Contact number must be 10-14 digits starting with non-zero';
    }
    
    // Required fields
    if (!formData.userName || !formData.userEmail || !formData.userContactNumber) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return false;
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
        userRole: 'USER', // Always set to USER role by default
        userContactNumber: formData.userContactNumber
      };
      
      await registerUser(userData);
      
      setMessage({ type: 'success', text: 'Registration successful! Please sign in.' });
      
      if (onRegisterSuccess) onRegisterSuccess();
      
      setTimeout(() => {
        setIsOpen(false);
        setFormData({
          userName: '',
          userEmail: formData.userEmail, // keep email for convenience
          userPassword: '',
          confirmPassword: '',
          userContactNumber: ''
        });
        setMessage(null);
        setFieldErrors({});
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
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
            Create Account
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
          <div>
            <Label htmlFor="userName">Full Name</Label>
            <Input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
            <Label htmlFor="userContactNumber">Contact Number</Label>
            <Input
              id="userContactNumber"
              name="userContactNumber"
              value={formData.userContactNumber}
              onChange={handleInputChange}
              placeholder="Enter your contact number"
              required
            />
            {fieldErrors.userContactNumber && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.userContactNumber}</p>
            )}
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
            {fieldErrors.userPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.userPassword}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog; 