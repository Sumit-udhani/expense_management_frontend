import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import AuthForm from '../Component/AuthForm';

const CreateCategory = ({ onCategoryCreated }) => {
  const [status, setStatus] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await api.post('/category', values);
        setStatus({ success: 'Category created successfully' });
        onCategoryCreated?.(res.data.category);
        resetForm();
      } catch (err) {
        setStatus({
          error: err.response?.data?.message || 'Failed to create category',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthFormWrapper>
      <Typography variant="h5" gutterBottom>Create Category</Typography>
      {status?.success && (
        <Typography color="success.main" sx={{ mb: 1 }}>
          {status.success}
        </Typography>
      )}
      {status?.error && (
        <Typography color="error.main" sx={{ mb: 1 }}>
          {status.error}
        </Typography>
      )}
      <AuthForm
        fields={[{ name: 'name', label: 'Category Name' }]}
        buttonLabel="Create"
        isLoading={formik.isSubmitting}
        error={null}
        formik={formik}
      />
    </AuthFormWrapper>
  );
};

export default CreateCategory;
