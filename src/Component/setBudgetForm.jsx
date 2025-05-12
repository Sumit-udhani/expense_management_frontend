import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';
import AuthForm from './AuthForm';
import ReusableModal from './ReusableModal';
import { CircularProgress } from '@mui/material';
const SetBudgetForm = ({ open, handleClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [msg,setMsg] = useState('')
  useEffect(() => {
    const fetchCategories = async () => {
      setMsg('Categories Loading')
      try {
        const res = await api.get('/category');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally{
        setCategoryLoading(false)
      }
    };
    fetchCategories();
  }, []);
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  
  const yearOptions = [2023, 2024, 2025].map(y => ({ label: y, value: y }));
  const formik = useFormik({
    initialValues: {
      amount: '',
      categoryId: 'overall',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
    
      
    validationSchema: Yup.object({
        amount: Yup.number()
          .required('Amount is required')
          .positive('Amount must be positive'),
        categoryId: Yup.mixed() 
          .nullable()
          .notRequired(),
      }),
      
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      setError('');
      try {
        const now = new Date();
        await api.post('/budget', {
          ...values,
          categoryId: values.categoryId === 'overall' ? null : parseInt(values.categoryId),

          month: parseInt(values.month),
          year: parseInt(values.year),
        });

        resetForm();
        onSuccess?.();
        handleClose();
      } catch (err) {
        console.error('Error setting budget:', err);
        setError('Failed to set budget');
      } finally {
        setIsLoading(false);
      }
    },
  });
  
  const fields = [
    {
      name: 'categoryId',
      label: 'Category',
      type: 'dropdown',
      options: [
        { value: 'overall', label: 'Overall Budget' }, 
        ...categories.map((cat) => ({
          value: String(cat.id),  
          label: cat.name,
        })),
      ]
      
      
    },
    {
      name: 'month',
      label: 'Month',
      type: 'dropdown',
      options: monthOptions
    },
    {
      name: 'year',
      label: 'Year',
      type: 'dropdown',
      options: yearOptions
    },
    
    {
      name: 'amount',
      label: 'Amount (₹)',
      type: 'number',
    },
  ];
  
  if (categoryLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
     
        <CircularProgress />
      </div>
    );
  }
  return (
    <ReusableModal open={open} handleClose={handleClose} title="Set Monthly Budget">
      <AuthForm
        formik={formik}
        fields={fields}
        buttonLabel="Save Budget"
        isLoading={isLoading}
        error={error}
      />
    </ReusableModal>
  );
};

export default SetBudgetForm;
