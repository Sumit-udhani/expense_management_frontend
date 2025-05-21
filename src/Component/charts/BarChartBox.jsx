import React from 'react';
import { Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const BarChartBox = ({ data, title = "Bar Chart" }) => {
  return (
    <Box sx={{ width: { xs: "100%", md: "45%" }, minHeight: 350 }}>
      <Typography variant="subtitle1" gutterBottom color="#CBD5E1">
        {title}
      </Typography>
      <ResponsiveContainer height={300}>
        <BarChart
          data={data}
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
            contentStyle={{ backgroundColor: "#CBD5E1", color: "#1E293B" }}
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
  );
};

export default BarChartBox;
