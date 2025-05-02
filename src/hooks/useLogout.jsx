import { useNavigate } from 'react-router-dom';

const useLogout = (setLoggedIn) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    navigate('/login');
  };

  return logout;
};

export default useLogout;
