import React, { useState } from 'react';
import {
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';
import api from '../api/axiosInterceptor';

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

        setSnackbar({
          open: true,
          message: 'Login Successfully',
          severity: 'success',
        });

        setTimeout(() => {
          if (role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/welcome');
          }

          setTimeout(() => setLoggedIn(true), 100);
        }, 1000);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'An error occurred',
          severity: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom sx={{textAlign:'center'}}>Let's Get Started</Typography>
      <p style={{ color: '#cbd5e1',textAlign:'center'}}>Login to continue to Expense Manager</p>

      <AuthForm
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
        formik={formik}
        buttonLabel="Log In"
        isLoading={formik.isSubmitting}
        footer={
          <>
            <Typography sx={{ mt: 2, color: '#cbd5e1' }}>
              Don’t have an account?{' '}
              <Link to="/signup" style={{ color: '#f8285a', textDecoration: 'none' }}>
                Signup
              </Link>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <Link to="/forgot-password" style={{ color: '#f8285a', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Typography>
          </>
        }
      />

     
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          // onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
          
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthFormWrapper>
  );
};

export default Login;
