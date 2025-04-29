import React, { useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';
import { useFormik, validateYupSchema } from 'formik';
import * as Yup from 'yup';
function ForgotPassword() {
  const [message, setMessage] = useState(''); 
  const formik = useFormik({
    initialValues: {
      email:''
    },
    validationSchema:Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await axios.post('http://localhost:8085/auth/forgot-password', values);
        setMessage('Password reset email sent');
    
      } catch (err) {
        setStatus({ error: err.response?.data?.message || 'An error occurred' });
      } finally {
        setSubmitting(false);
      }
    }
  })


  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom>Forgot Password</Typography>
      {message && <Typography color="primary" sx={{ mt: 1 }}>{message}</Typography>}
      <AuthForm
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
        ]}
        formik={formik}
        buttonLabel="Send Reset Link"
        
        isLoading={formik.isSubmitting}
        error={formik.status?.error}
      />
    </AuthFormWrapper>
  );
}

export default ForgotPassword;
