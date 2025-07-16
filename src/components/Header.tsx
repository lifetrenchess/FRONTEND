
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Login from './Login';
import Register from './Register';
import { loginUser, logoutUser, getCurrentUser, getUserRole, isAuthenticated } from '@/lib/auth';
import AventraLogo from '@/components/AventraLogo';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleStorage = () => setUser(getCurrentUser());
    const handleOpenLogin = () => setLoginOpen(true);
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('openLogin', handleOpenLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('openLogin', handleOpenLogin);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  const handleDashboardClick = () => {
    const role = getUserRole();
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'TRAVEL_AGENT') navigate('/agent');
    else navigate('/dashboard');
  };

  const getDashboardButtonText = () => {
    const role = getUserRole();
    if (role === 'ADMIN') return 'Admin Dashboard';
    if (role === 'TRAVEL_AGENT') return 'Agent Dashboard';
    return 'User Dashboard';
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}> 
        <AventraLogo size={64} />
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/about')}>About</Button>
        <Button variant="ghost" onClick={() => navigate('/contact')}>Contact</Button>
        <Button variant="ghost" onClick={() => navigate('/assistance')}>Support</Button>
        <Button variant="ghost" onClick={() => navigate('/reviews')}>Reviews</Button>
        {isAuthenticated() ? (
          <>
            <Button onClick={handleDashboardClick} className="bg-[#01E8B2] hover:bg-[#00d4a1] text-white">
              {getDashboardButtonText()}
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Login>
              <Button variant="outline" className="border-[#01E8B2] text-[#01E8B2] hover:bg-[#01E8B2] hover:text-white">
                Sign In
              </Button>
            </Login>
            <Register>
              <Button className="bg-[#01E8B2] hover:bg-[#00d4a1] text-white">
                Sign Up
              </Button>
            </Register>
            {/* Hidden Login component for auto-opening after registration */}
            <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
              <div style={{ display: 'none' }}></div>
            </Login>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
