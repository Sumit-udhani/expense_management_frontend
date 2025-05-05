import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';
import AuthForm from './AuthForm';

const AddExpenseForm = ({ onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      attachment: null,
      date: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
      categoryId: Yup.string().required('Category is required'),
      paymentMode: Yup.string().required('Payment Mode is required'),
      paymentStatus: Yup.string().required('Payment Status is required'),
      date: Yup.date().required('Date is required').nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      setError('');
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'attachment' && !value) return;
          formData.append(key, value);
        });

        await api.post('/expense', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        resetForm();
        onSuccess(); 
      } catch (err) {
        setError('Failed to add expense');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

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
    { name: 'date', type: 'date' },
    { name: 'attachment', type: 'file' },
  ];

  return (
    <AuthForm
      formik={formik}
      fields={fields}
      buttonLabel="Add Expense"
      isLoading={isLoading}
      error={error}
    />
  );
};

export default AddExpenseForm;
