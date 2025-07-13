import React from 'react';
import { Button } from '@/components/ui/button';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';

interface AuthButtonsProps {
  onAuthSuccess?: (userData: any) => void;
}

const AuthButtons = ({ onAuthSuccess }: AuthButtonsProps) => {
  const handleRegisterSuccess = () => {
    // Registration success - the login dialog will handle the actual auth success
    console.log('Registration successful, login dialog will open');
  };

  return (
    <div className="flex items-center gap-4">
      <LoginDialog onAuthSuccess={onAuthSuccess}>
        <Button variant="outline" className="border-[#01E8B2] text-[#01E8B2] hover:bg-[#01E8B2] hover:text-white">
          Sign In
        </Button>
      </LoginDialog>
      
      <RegisterDialog onRegisterSuccess={handleRegisterSuccess}>
        <Button className="bg-[#01E8B2] hover:bg-[#00d4a1] text-white">
          Sign Up
        </Button>
      </RegisterDialog>
    </div>
  );
};

export default AuthButtons; 