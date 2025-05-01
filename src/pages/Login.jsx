import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';
import api from '../api/axiosInterceptor';
import { useState } from 'react';
const Login = ({setLoggedIn}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post('/auth/login', values);
        const { token, role } = response.data;
    
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    
        setStatus({ success: 'Login Successfully' });
    
     
        setTimeout(() => {
          if (role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/welcome');
          }
    
         
          setTimeout(() => setLoggedIn(true), 100);
        }, 1000);
      } catch (err) {
        setStatus({ error: err.response?.data?.message || 'An error occurred' });
      } finally {
        setSubmitting(false);
      }
    }
    
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom>Let's Get Started</Typography>
      <p style={{ color: '#cbd5e1' }}>Login to continue to Expense Manager</p>
      <Typography
      variant="body1"
      color={status.success ? 'success.main' : 'error.main'}
      sx={{ mt: 2 }}
    >
      {status.success || status.error}
    </Typography>
      <AuthForm
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
        formik={formik}
        buttonLabel="Log In"
        isLoading={formik.isSubmitting}
        error={formik.status?.error}
        footer={
          <>
            <Typography sx={{ mt: 2, color: '#cbd5e1' }}>
              Don’t have an account? <Link to="/signup" style={{ color: '#f8285a', textDecoration: 'none' }}>Signup</Link>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <Link to="/forgot-password" style={{ color: '#f8285a', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Typography>
          </>
        }
      />
    </AuthFormWrapper>
  );
};

export default Login;
