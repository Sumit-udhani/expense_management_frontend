import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInterceptor';
import AuthForm from './AuthForm';
import ReusableModal from './ReusableModal';
import Loader from './Loader';

const SetBudgetForm = ({ open, handleClose, onSuccess, initialData, overallBudgetAmount, categoryName }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setMsg('Categories Loading');
      try {
        const res = await api.get('/category');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setCategoryLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: initialData?.amount || '',
      categoryId: 'overall',
      month: initialData?.month || new Date().getMonth() + 1,
      year: initialData?.year || new Date().getFullYear(),
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive'),
      categoryId: Yup.mixed().nullable().notRequired(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      setError('');

      const isCategoryBudget = values.categoryId !== 'overall';
      const budgetAmount = parseFloat(values.amount);
      const overallAmount = parseFloat(overallBudgetAmount);

      if (isCategoryBudget && overallAmount && budgetAmount > overallAmount) {
        setError('Category budget cannot be greater than overall budget');
        setIsLoading(false);
        return;
      }

      try {
        await api.post('/budget', {
          ...values,
          categoryId: isCategoryBudget ? parseInt(values.categoryId) : null,
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

  
  useEffect(() => {
    if (categoryName && categories.length > 0) {
      const match = categories.find((cat) => cat.name === categoryName);
      if (match) {
        formik.setFieldValue('categoryId', String(match.id));
      }
    }
  }, [categoryName, categories]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const yearOptions = [2023, 2024, 2025].map((y) => ({ label: y, value: y }));

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
      ],
    },
    {
      name: 'month',
      label: 'Month',
      type: 'dropdown',
      options: monthOptions,
    },
    {
      name: 'year',
      label: 'Year',
      type: 'dropdown',
      options: yearOptions,
    },
    {
      name: 'amount',
      label: 'Amount (₹)',
      type: 'number',
    },
  ];

  return (
    <ReusableModal open={open} handleClose={handleClose} title="Set Monthly Budget" maxWidth={350}>
      {categoryLoading ? (
        <Loader />
      ) : (
        <AuthForm
          formik={formik}
          fields={fields}
          buttonLabel="Save Budget"
          isLoading={isLoading}
          error={error}
        
        />
      )}
    </ReusableModal>
  );
};

export default SetBudgetForm;
