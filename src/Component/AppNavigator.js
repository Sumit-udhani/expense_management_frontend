import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppNavigator = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);

    const publicPaths = ['/signup', '/login', '/forgot-password', '/reset-password', '/verify-email'];
    if (!token && publicPaths.includes(location.pathname)) {
      return;
    }

    
    if (!token && location.pathname === '/') {
      navigate('/signup');
    } else if (token && location.pathname === '/') {
      navigate('/welcome');
    }
  }, [navigate, setLoggedIn, location]);

  return null;
};

export default AppNavigator;
