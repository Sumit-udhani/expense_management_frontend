import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader = ({ size = 40, thickness = 4, mt = 4, color = 'primary' }) => {
  return (
    <Box display="flex" justifyContent="center" mt={mt}>
      <CircularProgress size={size} thickness={thickness} color={color} />
    </Box>
  );
};

export default Loader;
