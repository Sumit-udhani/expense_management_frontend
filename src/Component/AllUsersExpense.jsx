import { useEffect, useState } from "react";
import { Box, Button, Typography,TextField } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "./ReusableTable";

const AllUsersExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm,setSearchTerm] = useState('')
  const rowsPerPage = 5;

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

  const columns = ["Title", "Amount", "Date", "User", "Category", "Tags"];

  const getRowData = (expense) => [
    expense.title,
    `₹${expense.amount}`,
    new Date(expense.date).toLocaleDateString(),
    expense.User?.name || "N/A",
    expense.Category?.name || "N/A",
    expense.Tags?.map((tag) => tag.name).join(", ") || "None",
  ];
  const filteredExpenses = expenses.filter(expense =>{
    return expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h6">All Users Expenses</Typography>
    <TextField
      label="Search by Name"
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
          Page {currentPage} of {totalPages||1}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          sx={{ ml: 2 }}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default AllUsersExpense;
