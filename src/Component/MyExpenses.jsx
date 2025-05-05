import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "./ReusableTable";
import ReusableModal from "./ReusableModal";
import AddExpenseForm from "./AddExpense";

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchExpense = async () => {
    try {
      const res = await api.get('/expense');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses');
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);
  const updateExpense = async(id) =>{
    try {
        const res = await api.put(`/expense/${id}`)
        se
    } catch (error) {
      
    }
  }
  const columns = ['Title', 'Amount', 'Category', 'Status', 'Payment Mode', 'Date'];

  const getRowData = (expense) => [
    expense.title,
    `₹${expense.amount}`,
    expense.Category?.name || 'N/A',
    expense.paymentStatus,
    expense.paymentMode,
    new Date(expense.date).toLocaleDateString(),
  ];

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">My Expenses</Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Expense
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <ReusableTable title="" columns={columns} rows={paginatedExpenses} getRowData={getRowData} />

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Typography variant="body2">
              Page {currentPage} of {totalPages || 1}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              sx={{ ml: 2 }}
            >
              Next
            </Button>
          </Box>
        </>
      )}

      <ReusableModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        title="Add Expense"
      >
        <AddExpenseForm
          onSuccess={() => {
            setOpenModal(false);
            fetchExpense();
          }}
        />
      </ReusableModal>
    </Box>
  );
};

export default MyExpenses;
