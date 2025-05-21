import React from 'react';
import { Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const PIE_COLORS = ["#F472B6", "#FBBF24", "#3B82F6"];

const PieChartBox = ({
  data = [],
  title = "Pie Chart",
  year,
  month,
  onYearChange,
  onMonthChange,
  yearOptions = [],
  monthOptions = [],
  DropdownComponent,
}) => {
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "45%" },
        minHeight: 350,
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
          {title}
        </Typography>
        {DropdownComponent && (
          <Box display="flex" gap={2} width={"200px"}>
            <DropdownComponent
              label="Year"
              name="year"
              value={year}
              onChange={onYearChange}
              options={yearOptions}
            />
            <DropdownComponent
              label="Month"
              name="month"
              value={month}
              onChange={onMonthChange}
              options={monthOptions}
            />
          </Box>
        )}
      </Box>
      <ResponsiveContainer height={300}>
        <PieChart>
          <Pie
            data={sortedData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ category, total }) => `${category}: ₹${total}`}
          >
            {sortedData.map((_, index) => (
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
  );
};

export default PieChartBox;
