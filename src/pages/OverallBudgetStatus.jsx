import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import api from "../api/axiosInterceptor";
import Dropdown from "../Component/ReusableDropdown";
import SetBudgetForm from "../Component/setBudgetForm";
import AuthButton from "../Component/AuthButton";
import Loader from "../Component/Loader";
import ReusableModal from "../Component/ReusableModal";
import CreateCategory from "../Component/CategoryForm"; 

const OverallBudgetStatus = ({ formik }) => {
  const [loading, setLoading] = useState(true);
  const [overallBudget, setOverallBudget] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [openBudgetModal, setOpenBudgetModal] = useState(null);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false); // ✅ Added state
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const [budgetRes, categoryRes] = await Promise.all([
        api.get(`/budget/status?month=${month}&year=${year}`),
        api.get(`/budget/category-distribution?month=${month}&year=${year}`),
      ]);

      const { overallBudget, totalSpent } = budgetRes.data;
      setOverallBudget(overallBudget);
      setTotalSpent(totalSpent);
      setCategoryDistribution(categoryRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [month, year]);

  const remaining = Number(overallBudget?.amount || 0) - totalSpent;
  const isOver = remaining < 0;

  if (loading) return <Loader />;
  if (error) return <Typography color="error">{error}</Typography>;
  const visibleCategories = categoryDistribution.filter(
    (cat) => cat.budget || cat.total > 0
  );
  return (
    <Box mt={3}>
      <Typography variant="h6">Overall Monthly Budget</Typography>

      {!overallBudget && (
        <AuthButton
          label="Set Budget"
          onClick={() => setOpenBudgetModal({ categoryId: null })}
        />
      )}

      <Box mb={2}>
        <AuthButton
          label="Create Category"
          onClick={() => {
            setCreateCategoryModalOpen(true);
        
            setSelectedExpense(null);

          }}
        />
      </Box>

      <ReusableModal
        open={createCategoryModalOpen} 
        handleClose={() => setCreateCategoryModalOpen(false)}
        title="Create Category"
        maxWidth={350}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CreateCategory
            onCategoryCreated={() => {
              setCreateCategoryModalOpen(false);
              fetchBudget()
            }}
          />
        </Box>
      </ReusableModal>

      <SetBudgetForm
        open={Boolean(openBudgetModal)}
        handleClose={() => {
          setOpenBudgetModal(null);
          if (formik) {
            formik.resetForm();
          }
        }}
        onSuccess={() => {
          setOpenBudgetModal(null);
          fetchBudget();
        }}
        initialData={openBudgetModal?.initialData || null}
        categoryId={openBudgetModal?.categoryId || null}
        categoryName={openBudgetModal?.categoryName || null} 
        month={month}
        year={year}
        overallBudgetAmount={overallBudget?.amount || 0}
      />

      <Box display="flex" gap={2} mt={2} mb={2}>
        <Box flex={1}>
          <Dropdown
            label="Month"
            name="month"
            value={month}
            onChange={setMonth}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: i + 1,
              label: new Date(0, i).toLocaleString("default", {
                month: "long",
              }),
            }))}
          />
        </Box>
        <Box flex={1}>
          <Dropdown
            label="Year"
            name="year"
            value={year}
            onChange={setYear}
            options={[2023, 2024, 2025].map((y) => ({ label: y, value: y }))}
          />
        </Box>
      </Box>

      {overallBudget ? (
        <>
          <Divider sx={{ my: 2 }} />
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderLeft: `6px solid ${isOver ? "#e53935" : "#43a047"}`,
              width: "250px",
            }}
          >
            <Typography>
              Budget: ₹{Number(overallBudget.amount).toFixed(2)}
            </Typography>
            <Typography>Spent: ₹{totalSpent.toFixed(2)}</Typography>
            <Typography color={isOver ? "error" : "text.secondary"}>
              Remaining: ₹{remaining.toFixed(2)} {isOver && "(Over budget)"}
            </Typography>
            <AuthButton
              label="Edit Budget"
              onClick={() =>
                setOpenBudgetModal({
                  categoryId: null,
                  initialData: overallBudget,
                })
              }
              size="small"
            />
          </Paper>
        </>
      ) : (
        <Typography>No overall budget set yet</Typography>
      )}

      {visibleCategories .length > 0 ? (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Category-wise Budget Status
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2}>
            {categoryDistribution.map((cat) => {
              const remaining = Number(cat.budget || 0) - Number(cat.total || 0);
              const isOver = remaining < 0;

              return (
                <Paper
                  key={cat.categoryId}
                  elevation={3}
                  sx={{
                    p: 2,
                    width: 250,
                    borderLeft: `6px solid ${isOver ? "#e53935" : "#43a047"}`,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {cat.category}
                  </Typography>
                  <Typography>
                    Budget: ₹{cat.budget ? Number(cat.budget).toFixed(2) : "Not set"}
                  </Typography>
                  <Typography>
                    Spent: ₹{Number(cat.total || 0).toFixed(2)}
                  </Typography>
                  <Typography color={isOver ? "error" : "text.secondary"}>
                    Remaining: ₹{remaining.toFixed(2)} {isOver && "(Over budget)"}
                  </Typography>
                  <AuthButton
                    label={cat.budget ? "Edit Budget" : "Set Budget"}
                    onClick={() =>
                      setOpenBudgetModal({
                        categoryId: cat.categoryId,
                        initialData: cat.budget ? { amount: cat.budget } : null,
                        categoryName: cat.category,
                      })
                    }
                    size="small"
                  />
                </Paper>
              );
            })}
          </Box>
        </Box>
      ):(
        <Box mt={1}>
        <Typography>No Category budget set yet</Typography>
        </Box>
      )}
    </Box>
  );
};

export default OverallBudgetStatus;
