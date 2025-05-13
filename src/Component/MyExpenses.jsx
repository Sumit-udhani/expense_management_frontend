import { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "./ReusableTable";
import ReusableModal from "./ReusableModal";
import AddExpenseForm from "./AddExpense";
import TableActionButton from "./TableActionButton";
import PaginationButton from "./PaginationButton";
import AuthButton from "./AuthButton";
import ReusableTextField from "./ReusableTextfield";
import debounce from "lodash.debounce";

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        setDebouncedSearchTerm(term);
      }, 500),
    []
  );

  const fetchExpense = async (page, search, sortColumn, sortOrder) => {
    setLoading(true);
    try {
      const res = await api.get(`/expense?page=${page}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`);
      setExpenses(res.data.data);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense(currentPage, debouncedSearchTerm, sortConfig.key, sortConfig.direction);
  }, [currentPage, debouncedSearchTerm, sortConfig]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm]);

  const handleSort = (column) => {
    const columnKeyMap = {
      "Title": "title",
      "Amount": "amount",
      "Category": "Category.name",
      "Status": "paymentStatus",
      "Payment Mode": "paymentMode",
      "Date": "date"
    };

    const backendColumn = columnKeyMap[column] || "title";

    setSortConfig((prev) => {
      const newDirection = prev.key === backendColumn && prev.direction === "asc" ? "desc" : "asc";
      setCurrentPage(1);
      return {
        key: backendColumn,
        direction: newDirection,
      };
    });
  };

  const deleteExpense = async () => {
    setLoading(true);
    try {
      await api.delete(`/expense/${expenseToDelete}`);
      fetchExpense(currentPage, debouncedSearchTerm, sortConfig.key, sortConfig.direction);
      setConfirmDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense");
      setLoading(false);
    }
  };

  const columns = [
    "Title",
    "Amount",
    "Category",
    "Status",
    "Payment Mode",
    "Date",
  ];

  const getRowData = (expense) => [
    expense.title,
    `₹${expense.amount}`,
    expense.Category?.name || "N/A",
    expense.paymentStatus,
    expense.paymentMode,
    new Date(expense.date).toLocaleDateString(),
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">My Expenses</Typography>
        <AuthButton
          label={"Add Expense"}
          onClick={() => {
            setOpenModal(true);
            setSelectedExpense(null);
          }}
          disabled={loading}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <ReusableTextField
          label="Search by Title"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setCurrentPage(1);
            debouncedSearch(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          disabled={loading}
          inputRef={inputRef}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) :expenses.length === 0 ? (
        <Typography mt={4} textAlign="center">
          No expenses found.
        </Typography>
      ) : (
        <>
          <ReusableTable
            columns={[...columns, "Actions"]}
            rows={expenses}
            getRowData={getRowData}
            actions={(expense) => (
              <>
                <TableActionButton
                  label="Edit"
                  color="primary"
                  onClick={() => {
                    setSelectedExpense(expense);
                    setOpenModal(true);
                  }}
                  sx={{ mr: 1 }}
                  disabled={loading}
                />
                <TableActionButton
                  label="Delete"
                  color="error"
                  onClick={() => {
                    setExpenseToDelete(expense.id);
                    setConfirmDeleteModalOpen(true);
                  }}
                  disabled={loading}
                />
              </>
            )}
            onSort={handleSort}
            sortConfig={sortConfig}
          />

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <PaginationButton
              label="Previous"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              sx={{ mr: 2 }}
            />

            <Typography variant="body2">
              Page {currentPage} of {totalPages || 1}
            </Typography>

            <PaginationButton
              label="Next"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0 || loading}
              sx={{ ml: 2 }}
            />
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
            fetchExpense(currentPage, debouncedSearchTerm, sortConfig.key, sortConfig.direction);
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
          <TableActionButton
            label={"Cancel"}
            color="primary"
            onClick={() => {
              setConfirmDeleteModalOpen(false);
              setExpenseToDelete(null);
            }}
          />
          <TableActionButton
            label={"Delete"}
            color="error"
            onClick={deleteExpense}
          />
        </Box>
      </ReusableModal>
    </Box>
  );
};

export default MyExpenses;
