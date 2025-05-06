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
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'asc' });

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

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const deleteExpense = async () => {
    try {
      await api.delete(`/expense/${expenseToDelete}`);
      fetchExpense();
      setConfirmDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
    }
  };

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

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const key = sortConfig.key;

    const getValue = (expense) => {
      switch (key) {
        case 'Title': return expense.title.toLowerCase();
        case 'Amount': return parseFloat(expense.amount);
        case 'Category': return expense.Category?.name?.toLowerCase() || '';
        case 'Status': return expense.paymentStatus;
        case 'Payment Mode': return expense.paymentMode;
        case 'Date': return new Date(expense.date);
        default: return '';
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">My Expenses</Typography>
        <Button variant="contained" onClick={() => {
          setOpenModal(true);
          setSelectedExpense(null);
        }}>
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
          <ReusableTable
            columns={[...columns, 'Actions']}
            rows={paginatedExpenses}
            getRowData={getRowData}
            actions={(expense) => (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setSelectedExpense(expense);
                    setOpenModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    setExpenseToDelete(expense.id);
                    setConfirmDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
            onSort={handleSort}
            sortConfig={sortConfig}
          />

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
        handleClose={() => {
          setOpenModal(false);
          setSelectedExpense(null);
        }}
        title={selectedExpense ? "Edit Expense" : "Add Expense"}
      >
        <AddExpenseForm
          initialData={selectedExpense}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedExpense(null);
            fetchExpense();
          }}
        />
      </ReusableModal>

      <ReusableModal
        open={confirmDeleteModalOpen}
        handleClose={() => {
          setConfirmDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        title="Confirm Deletion"
      >
        <Typography mb={2}>
          Are you sure you want to delete this expense?
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              setConfirmDeleteModalOpen(false);
              setExpenseToDelete(null);
            }}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteExpense}
          >
            Delete
          </Button>
        </Box>
      </ReusableModal>
    </Box>
  );
};

export default MyExpenses;
