import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Divider,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axiosInterceptor";
import ReusableTable from "../Component/ReusableTable";
import ReusableTextField from "../Component/ReusableTextfield";
import ReusableModal from "../Component/ReusableModal";
import AuthButton from "../Component/AuthButton";
import Loader from "../Component/Loader";
import ImageIcon from "@mui/icons-material/Image";
import UserProfileCard from "../Component/UserProfileCard";

const UserDetailsPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()
  useEffect(() => {
    fetchData();
  }, [id, page, search, sortConfig]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, profileRes] = await Promise.all([
        api.get(`/admin/users/${id}/expenses`, {
          params: {
            page,
            search,
            sortColumn: sortConfig.key,
            sortOrder: sortConfig.direction,
          },
        }),
        api.get(`/auth/me`, { params: { id } }),
      ]);

      const fetchedExpenses = expensesRes.data.data;
      const fetchedTotalPages = expensesRes.data.totalPages;
      
      setExpenses(fetchedExpenses);
      setTotalPages(fetchedTotalPages > 0 ? fetchedTotalPages : 1);
      if (fetchedTotalPages === 0) setPage(1); // optional: reset to 1 if no data
      
      setProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const direction = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });
    setPage(1);
  };

  const columns = ["Title", "Amount", "Category", "Date"];

  const getRowData = (expense) => [
    expense.title,
    `₹${expense.amount}`,
    expense.Category?.name || "N/A",
    new Date(expense.date).toLocaleDateString(),
  ];

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <Box mt={4}>
        <Typography color="error">User not found.</Typography>
      </Box>
    );
  }

  const transformedProfile = {
    name: profile?.name || "-",
    email: profile?.email || "-",
    image: profile?.image || "",
    mobileNo: profile?.UserProfile?.mobileNo || "-",
  };

  return (
    <Box p={3}>
    <Box>
      <AuthButton 
      label={"Back"}
      onClick={()=> navigate('/admin/dashboard')}
      variant="outlined"
      />
      </Box>
      <UserProfileCard
        profile={transformedProfile}
        onImageUpload={() => {}}
        selectedFile={null}
        setSelectedFile={() => {}}
        loading={false}
        
        editOpen={false}
        setEditOpen={() => {}}
      />

      <Typography variant="h6" gutterBottom color="#F8FAFC" mt={4}>
        User Expenses
      </Typography>

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
        columns={[...columns, "Actions"]}
        rows={expenses}
        getRowData={getRowData}
        actions={(expense) => (
          <AuthButton
            label="View"
            color="info"
            size="small"
            onClick={() => {
              setSelectedExpense(expense);
              setViewModalOpen(true);
            }}
            variant="outlined"
          />
        )}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <AuthButton
          label="Prev"
          variant="outlined"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
        />
        <Typography>
      
          Page {page} of {totalPages}
        </Typography>
        <AuthButton
          label="Next"
          variant="outlined"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0 || loading}
        />
      </Box>

      <ReusableModal
        open={viewModalOpen}
        handleClose={() => {
          setViewModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Expense Details"
        maxWidth="400px"
      >
        <Divider sx={{ my: 1, borderColor: "#3b82f6" }} />
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
                  <Typography>{selectedExpense.Category?.name || "N/A"}</Typography>
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
                  <Typography>{new Date(selectedExpense.date).toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </Box>

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
                    height: "70px",
                    width:"300px"
                  }}
                >
                  <ImageIcon color="secondary" />
                  <Link
                    href={`http://localhost:8085/${selectedExpense.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      wordBreak: "break-all",
                      textDecoration: "none",
                      color: "#f9fafb",
                      textAlign: "center",
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
