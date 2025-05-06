import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "./ReusableTable";

const AllUsersExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'asc' });
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/admin/expenses');
        setExpenses(res.data);
       
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);
  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns = ["Title", "Amount", "User", "Category","Status","Payment Mode","Date"];

  const getRowData = (expense) => [
   
    expense.title,
    `₹${expense.amount}`,
    expense.User?.name || "N/A",
    expense.Category?.name || "N/A",
    expense.paymentStatus,
    expense.paymentMode,
    new Date(expense.date).toLocaleDateString(),
    // expense.Tags?.map((tag) => tag.name).join(", ") || "None",
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
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">All Users Expenses</Typography>
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

      <ReusableTable
      title=""
      columns={columns}
      rows={paginatedExpenses}
      getRowData={getRowData}
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
  );
};

export default AllUsersExpense;
