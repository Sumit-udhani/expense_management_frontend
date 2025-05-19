import { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Link,
  Paper,
  Divider,
  useMediaQuery,
  Grid,
  Stack,
  useTheme,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import api from "../api/axiosInterceptor";
import ReusableTable from "./ReusableTable";
import ReusableModal from "./ReusableModal";
import AddExpenseForm from "./AddExpense";
import TableActionButton from "./TableActionButton";
import PaginationButton from "./PaginationButton";
import AuthButton from "./AuthButton";
import ReusableTextField from "./ReusableTextfield";
import debounce from "lodash.debounce";
import CreateCategory from "./CategoryForm";

const MyExpenses = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce((term) => setDebouncedSearchTerm(term), 500),
    []
  );

  const fetchExpense = async (page, search, sortColumn, sortOrder) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/expense?page=${page}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
      );
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

  useEffect(() => () => debouncedSearch.cancel(), []);
  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm]);

  const handleSort = (column) => {
    const columnKeyMap = {
      Title: "title",
      Amount: "amount",
      Category: "Category.name",
      Status: "paymentStatus",
      "Payment Mode": "paymentMode",
      Date: "date",
    };
    const backendColumn = columnKeyMap[column] || "title";
    setSortConfig((prev) => ({
      key: backendColumn,
      direction: prev.key === backendColumn && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
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

  const columns = ["Title", "Amount", "Category", "Status", "Payment Mode", "Date"];

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
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "stretch" : "center"}
        mb={2}
      >
        <Typography variant="h6">My Expenses</Typography>
        <AuthButton
          label="Add Expense"
          onClick={() => {
            setOpenModal(true);
            setSelectedExpense(null);
          }}
          disabled={loading}
        />
      </Stack>

      <Box mb={2}>
        <AuthButton
          label="Create Category"
          onClick={() => {
            setCreateCategoryModalOpen(true);
            setSelectedExpense(null);
          }}
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
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
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
      ) : expenses.length === 0 ? (
        <Typography mt={4} textAlign="center">
          No expenses found.
        </Typography>
      ) : (
        <>
        <Box sx={{ overflowX: "auto" }}>
        <ReusableTable
          columns={[...columns, "Actions"]}
          rows={expenses}
          getRowData={getRowData}
          actions={(expense) => (
            <Box display="flex" flexWrap="wrap" gap={1}>
              <TableActionButton
                label="Edit"
                color="primary"
                onClick={() => {
                  setSelectedExpense(expense);
                  setOpenModal(true);
                }}
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
      </Box>
      

          <Stack direction="row" justifyContent="center" alignItems="center" mt={2} spacing={2}>
            <PaginationButton
              label="Previous"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            />
            <Typography variant="body2">Page {currentPage} of {totalPages || 1}</Typography>
            <PaginationButton
              label="Next"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0 || loading}
            />
          </Stack>
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
        open={createCategoryModalOpen}
        handleClose={() => setCreateCategoryModalOpen(false)}
        title="Create Category"
      >
        <CreateCategory
          onCategoryCreated={() => {
            setCreateCategoryModalOpen(false);
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
        <Typography mb={2}>Are you sure you want to delete this expense?</Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <TableActionButton label="Cancel" color="primary" onClick={() => setConfirmDeleteModalOpen(false)} />
          <TableActionButton label="Delete" color="error" onClick={deleteExpense} />
        </Box>
      </ReusableModal>

      <ReusableModal
        open={viewModalOpen}
        handleClose={() => {
          setViewModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Expense Details"
        maxWidth="md"  
        fullWidth   
      >
        <Divider sx={{ my: 1, borderColor: "#3b82f6" }} />
        {selectedExpense ? (
          <Box component={Paper} elevation={0}>
          <Grid container spacing={2}>
          {[
            { label: "Title", value: selectedExpense.title },
            { label: "Amount", value: `₹${selectedExpense.amount}` },
            { label: "Category", value: selectedExpense.Category?.name || "N/A" },
            { label: "Status", value: selectedExpense.paymentStatus },
            { label: "Payment Mode", value: selectedExpense.paymentMode },
            {
              label: "Date",
              value: new Date(selectedExpense.date).toLocaleDateString(),
            },
          ].map(({ label, value }) => (
            <Grid item xs={12} sm={6} md={4} key={label}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography>{value}</Typography>
            </Grid>
          ))}
        </Grid>
        

            {selectedExpense.attachment && (
              <Box mt={2}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: "8px",
                    border: "1px solid",
                    backgroundColor: "transparent",
                    color: "#f9fafb",
                    width: "100%",
                    overflow: "hidden",
                    height: "90px",
                  }}
                >
                  <ImageIcon color="secondary" />
                  <Link
                    href={`http://localhost:8085/${selectedExpense.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ wordBreak: "break-all", textDecoration: "none", color: "#f9fafb" }}
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

export default MyExpenses;
