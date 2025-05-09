import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper, Divider } from '@mui/material';
import api from '../api/axiosInterceptor';

const BudgetStatus = () => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError('');

        const [budgetRes, expenseRes] = await Promise.all([
          api.get('/budget/status'),
          api.get('/expense'),
        ]);

        const budgetMap = {};
        budgetRes.data.budgets.forEach((budget) => {
          // Only include category-specific budgets
          if (budget.categoryId !== null) {
            budgetMap[budget.categoryId] = {
              ...budget,
              spent: 0,
              categoryName: budget.Category?.name || 'Unknown',
            };
          }
        });

        expenseRes.data.forEach((expense) => {
          const catId = expense.categoryId;
          const expenseDate = new Date(expense.date);
          const now = new Date();
          const isSameMonth =
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear();

          if (isSameMonth && budgetMap[catId]) {
            budgetMap[catId].spent += Number(expense.amount);
          }
        });

        setBudgets(Object.values(budgetMap));
      } catch (err) {
        console.error(err);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={3}>
        {error}
      </Typography>
    );
  }

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Category-wise Budgets (This Month)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {budgets.length === 0 ? (
          <Typography>No category budgets set for this month.</Typography>
        ) : (
          budgets.map((b) => {
            const isOver = b.spent > b.amount;
            return (
              <Grid item xs={12} md={6} key={b.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderLeft: `6px solid ${isOver ? '#e53935' : '#43a047'}`,
                  }}
                >
                  <Typography variant="subtitle1">{b.categoryName}</Typography>
                  <Typography>Budget: ₹{Number(b.amount).toFixed(2)}</Typography>
                  <Typography color={isOver ? 'error' : 'text.secondary'}>
                    Spent: ₹{b.spent.toFixed(2)} {isOver && '(Over budget)'}
                  </Typography>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default BudgetStatus;
