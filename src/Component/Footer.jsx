import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        textAlign: 'center',
        bgcolor: '#0f172a',
        color: 'white',
        height: { xs: 60, sm: 70, md: 20 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
       
        mt: 'auto',
      }}
    >
      <Typography variant="body2">© 2025 All rights reserved</Typography>
    </Box>
  );
};

export default Footer;
