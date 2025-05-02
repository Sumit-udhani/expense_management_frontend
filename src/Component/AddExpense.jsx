import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';
import AuthForm from '../Component/AuthForm';
import AuthFormWrapper from '../Component/AuthFormWrapper';
import Dropdown from './ReusableDropdown'; // Import Dropdown component
import { Box, Typography, TextField } from '@mui/material';

const AddExpense = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/category');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      amount: '',
      categoryId: '',
      paymentMode: 'Cash',
      paymentStatus: 'Pending',
      attachment: null, // Attachment is initially null
      date: '', // Add date field
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
      categoryId: Yup.string().required('Category is required'),
      paymentMode: Yup.string().required('Payment Mode is required'),
      paymentStatus: Yup.string().required('Payment Status is required'),
      date: Yup.date().required('Date is required').nullable(), // Validate date
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      setError('');
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('amount', values.amount);
        formData.append('categoryId', values.categoryId);
        formData.append('paymentMode', values.paymentMode);
        formData.append('paymentStatus', values.paymentStatus);
        formData.append('date', values.date); // Append date field
        if (values.attachment) {
          formData.append('attachment', values.attachment); // Append the file if exists
        }

        await api.post('/expense', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        resetForm();
        alert('Expense added successfully!');
      } catch (err) {
        setError('Failed to add expense');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Prepare fields for reusable form
  const fields = [
    { name: 'title', label: 'Title' },
    { name: 'amount', label: 'Amount', type: 'number' },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'dropdown',
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'dropdown',
      options: [
        { value: 'Cash', label: 'Cash' },
        { value: 'Credit', label: 'Credit' },
        { value: 'Debit', label: 'Debit' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
      ],
    },
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      type: 'dropdown',
      options: [
        { value: 'Paid', label: 'Paid' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Failed', label: 'Failed' },
      ],
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date', // Use date input
    },
    {
      name: 'attachment',
      label: 'Attachment',
      type: 'file', // File input field for attachment
    },
  ];

  return (
    <AuthFormWrapper>
      <Typography variant="h5" gutterBottom>Add Expense</Typography>
      <Box
        sx={{
          maxHeight: '500px', // Set a max height for scrolling
          overflowY: 'auto', // Allow vertical scrolling if content overflows
          padding: '20px', // Optional padding
        }}
      >
        <AuthForm
          formik={formik}
          fields={fields}
          buttonLabel="Add Expense"
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </AuthFormWrapper>
  );
};

export default AddExpense;
