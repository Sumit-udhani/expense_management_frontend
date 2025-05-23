import React, { useEffect, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import api from "../api/axiosInterceptor";
import Dropdown from "../Component/ReusableDropdown";
import BarChartBox from "../Component/charts/BarChartBox";
import PieChartBox from "../Component/charts/PieChartBox";
import Loader from "../Component/Loader";
function EmployeeDashboard() {
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [monthlyRes, pieRes, statusRes] = await Promise.all([
          api.get(`/budget/monthly-total?year=${year}`),
          api.get(`/budget/category-distribution?month=${month}&year=${year}`),
          api.get(`/budget/status?month=${month}&year=${year}`),
        ]);
        setMonthlyTotals(monthlyRes.data);
        setCategoryDistribution(pieRes.data);
        setBudgetStatus(statusRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, month]);

  if (loading) return <Loader />

  const totalBudget = budgetStatus?.overallBudget?.amount || 0;
  const totalSpent = budgetStatus?.totalSpent || 0;
  const progress = ((totalSpent / totalBudget) * 100).toFixed(0);
  const yearOptions = [2023, 2024, 2025].map((y) => ({ label: y, value: y }));
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const last6Months = monthlyTotals
    .map((item, index) => ({ ...item, index }))
    .filter((item) => {
      const itemMonthIndex = item.index;
      const itemDate = new Date(year, itemMonthIndex);
      const compareDate = new Date(currentYear, currentMonth - 5);
      return itemDate >= compareDate && itemDate <= now;
    });

  return (
    <Box sx={{ width: "100%", px: 2, py: 3 }}>
      <Typography variant="h5" mb={3} color="#F8FAFC">
        Dashboard Insights
      </Typography>
      
      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="#CBD5E1">
            Overall Budget Progress
          </Typography>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#334155",
              borderRadius: 2,
              overflow: "hidden",
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                backgroundColor: "#3B82F6",
                height: 20,
              }}
            />
          </Box>
          <Typography variant="caption" color="#CBD5E1">
            {totalSpent} / {totalBudget} (₹)
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <BarChartBox data={last6Months} title="Monthly Expenses" />
            <PieChartBox
              data={categoryDistribution}
              title="Category-wise Expenses"
              year={year}
              month={month}
              onYearChange={setYear}
              onMonthChange={setMonth}
              yearOptions={yearOptions}
              monthOptions={monthOptions}
              DropdownComponent={Dropdown}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
