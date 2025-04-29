import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(5, 'Minimum 5 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await axios.post('http://localhost:8085/auth/signup', values);
        setStatus({ success: 'Verification Email sent Successfully' });
      } catch (err) {
        setStatus({ error: err.response?.data?.message || 'An error occurred' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h4" gutterBottom>Get started with Us</Typography>
      <p style={{ color: '#cbd5e1' }}>Register a new User</p>
      {formik.status?.success && <Typography color="primary">{formik.status.success}</Typography>}
      <AuthForm
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
        formik={formik}
        buttonLabel="Sign Up"
        isLoading={formik.isSubmitting}
        error={formik.status?.error}
        footer={
          <Typography sx={{ mt: 2, color: '#cbd5e1' }}>
            Already have an account? <Link to="/login" style={{ color: '#f8285a', textDecoration: 'none' }}>Login</Link>
          </Typography>
        }
      />
    </AuthFormWrapper>
  );
}
