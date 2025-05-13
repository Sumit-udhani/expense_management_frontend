import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ReusableTable from '../Component/ReusableTable';
import api from '../api/axiosInterceptor';
const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, expensesRes] = await Promise.all([
          api.get(`/admin/users/${id}`),
          api.get(`/admin/users/${id}/expenses`),
        ]);
        setUser(userRes.data);
        setExpenses(expensesRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });

    const sorted = [...expenses].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setExpenses(sorted);
  };

  const columns = ['Title', 'Amount', 'Category', 'Date'];

  const getRowData = (expense) => [
    expense.title,
    `₹${expense.amount}`,
    expense.Category?.name || 'N/A',
    new Date(expense.date).toLocaleDateString(),
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box mt={4}>
        <Typography color="error">User not found.</Typography>
      </Box>
    );
  }

  return (
    
    <Box p={3}>
    <Typography variant="h5" gutterBottom>
    User Details page
  </Typography>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#1E293B',
          color: '#F8FAFC',
          p: 3,
          mb: 4,
          border: '1px solid #334155',
          width:'400px'
        }}
      >
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Divider sx={{ my: 1, borderColor: '#3b82f6' }} />
        <Typography>Email: {user.email}</Typography>
        <Typography>Role: {user.Role?.name || 'N/A'}</Typography>



        <Typography>Status: {user.isActive ? 'Active' : 'Inactive'}</Typography>
      </Paper>

      <Typography variant="h6" gutterBottom color="#F8FAFC">
        User Expenses
      </Typography>
      <ReusableTable
        columns={columns}
        rows={expenses}
        getRowData={getRowData}
        onSort={handleSort}
        sortConfig={sortConfig}
         
      />
    </Box>
  );
};

export default UserDetailsPage;
