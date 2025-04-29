import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await axios.post('http://localhost:8085/auth/login', values);
        localStorage.setItem('token', response.data.token);
        navigate('/'); 
      } catch (err) {
        setStatus({ error: err.response?.data?.message || 'An error occurred' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom>Let's Get Started</Typography>
      <p style={{ color: '#cbd5e1' }}>Login to continue to Expense Manager</p>
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
