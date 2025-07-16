import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth';

interface LoginProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAuthSuccess?: (userData: any) => void;
  children?: React.ReactNode;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onAuthSuccess, children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const isDialogOpen = isOpen !== undefined ? isOpen : open;
  const handleOpenChange = (newOpen: boolean) => {
    if (onClose) {
      onClose();
    } else {
      setOpen(newOpen);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      handleOpenChange(false);
      
      // Call onAuthSuccess if provided, otherwise use default navigation
      if (onAuthSuccess) {
        onAuthSuccess(result.user);
      } else {
        // Default navigation based on role
        if (result.user.role === 'ADMIN') {
          navigate('/admin');
        } else if (result.user.role === 'TRAVEL_AGENT') {
          navigate('/agent');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="userPassword">Password</Label>
            <Input
              id="userPassword"
              name="userPassword"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-[#01E8B2] hover:bg-[#00d4a1] text-white"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Login; 