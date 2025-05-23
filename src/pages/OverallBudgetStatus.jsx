import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import api from "../api/axiosInterceptor";
import Dropdown from "../Component/ReusableDropdown";
import SetBudgetForm from "../Component/setBudgetForm";
import AuthButton from "../Component/AuthButton";
import Loader from "../Component/Loader";

const OverallBudgetStatus = () => {
  const [loading, setLoading] = useState(true);
  const [overallBudget, setOverallBudget] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [openBudgetModal, setOpenBudgetModal] = useState(false);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/budget/status?month=${month}&year=${year}`);
      const { overallBudget, totalSpent } = res.data;
      setOverallBudget(overallBudget);
      setTotalSpent(totalSpent);
    } catch (err) {
      console.error(err);
      setError("Failed to load overall budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [month, year]);

  const remaining = Number(overallBudget?.amount || 0) - totalSpent;
  const isOver = remaining < 0;

  if (loading)
    return (
     <Loader/>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box mt={3}>
      <Typography variant="h6">Overall Monthly Budget</Typography>

      {!overallBudget &&(

        <AuthButton
          label={!overallBudget && "Set Budget" }
          onClick={() => setOpenBudgetModal(true)}
        />
      )}
      <SetBudgetForm
      open={openBudgetModal}
      handleClose={() => setOpenBudgetModal(false)}
      onSuccess={fetchBudget}
      initialData={overallBudget} 
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
            onBlur={() => {}}
            error=""
            touched={false}
          />
        </Box>
        <Box flex={1}>
          <Dropdown
            label="Year"
            name="year"
            value={year}
            onChange={setYear}
            options={[2023, 2024, 2025].map((y) => ({ label: y, value: y }))}
            onBlur={() => {}}
            error=""
            touched={false}
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
              borderLeft: `6px solid ${isOver ? "#e53935" : "#43a047"}`,width:'250px'
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
            label={overallBudget ? "Edit Budget" : "Set Budget"}
            onClick={() => setOpenBudgetModal(true)}
            size="small"
          />
          </Paper>
        </>
      ) : (
        <Typography> No overall budget set yet</Typography>
      )}
    </Box>
  );
};

export default OverallBudgetStatus;
