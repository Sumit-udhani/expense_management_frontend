import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ReusableTable from '../Component/ReusableTable';
import api from '../api/axiosInterceptor';
import TableActionButton from '../Component/TableActionButton';
import ReusableModal from '../Component/ReusableModal';
import ImageIcon from '@mui/icons-material/Image';
import PaginationButton from '../Component/PaginationButton';
import ReusableTextField from '../Component/ReusableTextfield';

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [id, page, search, sortConfig]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, expensesRes] = await Promise.all([
        api.get(`/admin/users/${id}`),
        api.get(`/admin/users/${id}/expenses`, {
          params: {
            page,
            search,
            sortColumn: sortConfig.key,
            sortOrder: sortConfig.direction,
          },
        }),
      ]);
      setUser(userRes.data);
      setExpenses(expensesRes.data.data);
      setTotalPages(expensesRes.data.totalPages);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
    setPage(1); // reset to first page on sort change
  };

  // ... rest of your component unchanged

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
        User Details Page
      </Typography>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#1E293B',
          color: '#F8FAFC',
          p: 3,
          mb: 4,
          border: '1px solid #334155',
          width: '400px',
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

      {/* Search Field */}
      <Box mb={2} display="flex" gap={2} alignItems="center">
        <ReusableTextField
          label="Search by title"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Box>

      <ReusableTable
        columns={[...columns, 'Actions']}
        rows={expenses}
        getRowData={getRowData}
        actions={(expense) => (
          <Box display="flex" gap={1}>
            <TableActionButton
              label="View"
              color="info"
              onClick={() => {
                setSelectedExpense(expense);
                setViewModalOpen(true);
              }}
              disabled={loading}
            />
          </Box>
        )}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* Pagination Controls */}
      <Box mt={2} sx={{display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <PaginationButton
          label="Prev"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          sx={{ mr: 2 }}
        />
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        <PaginationButton
          label="Next"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Expense Detail Modal */}
      <ReusableModal
        open={viewModalOpen}
        handleClose={() => {
          setViewModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Expense Details"
      >
        <Divider sx={{ my: 1, borderColor: '#3b82f6' }} />
        {selectedExpense ? (
          <Box>
            <Box component={Paper} elevation={0}>
              <Box
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gridTemplateRows="repeat(2, auto)"
                gap={3}
                mb={3}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Title
                  </Typography>
                  <Typography>{selectedExpense.title}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography>₹{selectedExpense.amount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Typography>
                    {selectedExpense.Category?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography>{selectedExpense.paymentStatus}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment Mode
                  </Typography>
                  <Typography>{selectedExpense.paymentMode}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography>
                    {new Date(selectedExpense.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {selectedExpense.attachment && (
              <Box mt={2}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: '8px',
                    border: '1px solid',
                    backgroundColor: 'transparent',
                    color: '#f9fafb',
                    width: '100%',
                    overflow: 'hidden',
                    height: '90px',
                  }}
                >
                  <ImageIcon color="secondary" />
                  <Link
                    href={`http://localhost:8085/${selectedExpense.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      wordBreak: 'break-all',
                      textDecoration: 'none',
                      color: '#f9fafb',
                      textAlign: 'center',
                    }}
                  >
                    Attachment
                  </Link>
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>No data available.</Typography>
        )}
      </ReusableModal>
    </Box>
  );
};

export default UserDetailsPage;
