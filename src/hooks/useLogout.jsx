import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 import { logout } from '../store/features/auth/authSlice';
const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
  
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    
    dispatch(logout());
    navigate('/login');
  };

  return handleLogout;
};

export default useLogout;
