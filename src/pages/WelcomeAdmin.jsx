import React from 'react';
import { Typography, Box } from '@mui/material';

function WelcomeAdmin() {
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      px: 2,
      color: 'text.primary',
    }}
  >
    <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
      Welcome on Admin Dashboard
    </Typography>
  </Box>
  
  );
}

export default WelcomeAdmin;
