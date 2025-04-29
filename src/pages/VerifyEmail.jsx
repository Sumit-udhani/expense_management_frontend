import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../Component/AuthFormWrapper';
const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:8085/auth/verify-email?token=${token}`);
        setStatus('Email verified successfully!');
      } catch (err) {
        setStatus('Verification failed. Invalid or expired token.');
      }
    };
    if (token) verifyEmail();
  }, [token]);

  return (
    <AuthFormWrapper backgroundColor="#f9f9fc">
      <Typography variant="h5" gutterBottom>Email Verification</Typography>
      <Typography variant="body1" color={status.includes('successfully') ? 'success.main' : 'error'} sx={{ mt: 2 }}>
        {status}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 3 }}>
        Go to Login
      </Button>
    </AuthFormWrapper>
  );
};

export default VerifyEmail;
