import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, CircularProgress } from "@mui/material";
import api from "../api/axiosInterceptor";
import Dropdown from "../Component/ReusableDropdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#F472B6", "#FBBF24", "#3B82F6"];

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

  if (loading) return <CircularProgress />;

  const totalBudget = budgetStatus?.overallBudget?.amount || 0;
  const totalSpent = budgetStatus?.totalSpent || 0;
  const progress = ((totalSpent / totalBudget) * 100).toFixed(0);
  const sortedCategories = [...categoryDistribution].sort(
    (a, b) => b.total - a.total
  );

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
            {/* Bar Chart on the left */}
            <Box sx={{ width: { xs: "100%", md: "45%" }, minHeight: 350 }}>
              <Typography variant="subtitle1" gutterBottom color="#CBD5E1">
                Monthly Expenses
              </Typography>
              <ResponsiveContainer height={300}>
                <BarChart
                  data={last6Months}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barCategoryGap={10}
                >
                  <XAxis
                    dataKey="month"
                    stroke="#CBD5E1"
                    tick={{ fontSize: 12 }}
                    angle={-40}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis stroke="#CBD5E1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#CBD5E1",
                      color: "#1E293B",
                    }}
                    formatter={(value) => `₹${value.toFixed(2)}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="#4F46E5"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

          
            <Box
              sx={{
                width: { xs: "100%", md: "45%" },
                minHeight: 350,
                marginLeft: { md: "auto" },
                mt: { xs: 4, md: 0 },
              }}
            >
              <Box
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1" color="#CBD5E1">
                  Category-wise Expenses
                </Typography>
                <Box display="flex" gap={2} width={"200px"}>
                  <Dropdown
                    label="Year"
                    name="year"
                    value={year}
                    onChange={setYear}
                    options={yearOptions}
                  />
                  <Dropdown
                    label="Month"
                    name="month"
                    value={month}
                    onChange={setMonth}
                    options={monthOptions}
                  />
                </Box>
              </Box>
              <ResponsiveContainer height={300}>
                <PieChart>
                  <Pie
                    data={sortedCategories}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, total }) => `${category}: ₹${total}`}
                  >
                    {sortedCategories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                  <Tooltip
                    formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
                    contentStyle={{
                      backgroundColor: "#3b82f6",
                      color: "#F8FAFC",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
