import React, { useState } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const token = new URLSearchParams(location.search).get('token');

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(5, 'Password must be at least 5 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.post(`/auth/reset-password?token=${token}`,{ 
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        setMessage('Password reset successful');
        setStatus({ error: null });
        setTimeout(()=>{

          navigate('/login');
        },2000)
      } catch (err) {
        setStatus({ error: err.response?.data?.message || 'An error occurred' });
        setMessage('');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
      {message && <Typography color="#66bb6a" sx={{ mt: 1 }}>{message}</Typography>}
      <AuthForm
        fields={[
          { name: 'newPassword', label: 'New Password', type: 'password' },
          { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
        ]}
        formik={formik}
        buttonLabel="Reset Password"
        isLoading={formik.isSubmitting}
        error={formik.status?.error}
      />
    </AuthFormWrapper>
  );
};

export default ResetPassword;
