import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#263238' }}>
      <Toolbar>
        <Typography variant="h6" component="div"  textAlign={"center"} sx={{ flexGrow: 1 }}>
          Expense Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
