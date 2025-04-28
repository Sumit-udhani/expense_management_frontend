import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <Box sx={{ textAlign: 'center', marginTop: 5 }}>
      <Typography variant="h6">{status}</Typography>
      <Button variant="contained" onClick={() => navigate('/login')} sx={{ marginTop: 2 }}>
        Go to Login
      </Button>
    </Box>
  );
};

export default VerifyEmail;
