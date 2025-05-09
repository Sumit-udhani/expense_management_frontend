import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import api from '../api/axiosInterceptor';
import Dropdown from '../Component/ReusableDropdown';

const OverallBudgetStatus = () => {
  const [loading, setLoading] = useState(true);
  const [overallBudget, setOverallBudget] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const yearOptions = [2023, 2024, 2025].map((y) => ({
    value: y,
    label: y.toString(),
  }));

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/budget/status?month=${month}&year=${year}`);
        const { overallBudget, totalSpent } = res.data;
        setOverallBudget(overallBudget);
        setTotalSpent(totalSpent);
      } catch (err) {
        console.error(err);
        setError('Failed to load overall budget');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [month, year]);

  if (loading) return <Box display="flex" justifyContent="center" mt={3}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!overallBudget) return <Typography>No overall budget set for selected month/year.</Typography>;

  const remaining = Number(overallBudget.amount) - totalSpent;
  const isOver = remaining < 0;

  return (
    <Box mt={3}>
      <Typography variant="h6">Overall Monthly Budget</Typography>
      <Box display="flex" gap={2} mt={2} mb={2}>
        <Box flex={1}>
          <Dropdown
            label="Month"
            name="month"
            value={month}
            onChange={setMonth}
            options={monthOptions}
            onBlur={() => {}}
            error=""
            touched={false}
          />
        </Box>
        <Box flex={1}>
          <Dropdown
            label="Year"
            name="year"
            value={year}
            onChange={setYear}
            options={yearOptions}
            onBlur={() => {}}
            error=""
            touched={false}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Paper elevation={3} sx={{ p: 2, borderLeft: `6px solid ${isOver ? '#e53935' : '#43a047'}` }}>
        <Typography>Budget: ₹{Number(overallBudget.amount).toFixed(2)}</Typography>
        <Typography>Spent: ₹{totalSpent.toFixed(2)}</Typography>
        <Typography color={isOver ? 'error' : 'text.secondary'}>
          Remaining: ₹{remaining.toFixed(2)} {isOver && '(Over budget)'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default OverallBudgetStatus;
