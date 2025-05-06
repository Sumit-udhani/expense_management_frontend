import { Button } from '@mui/material';
import React from 'react';

const AuthButton = ({ label, onClick, isLoading,...props }) => {
  return (
    <Button
      type="button"
     
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={isLoading}
      sx={{ mt: 3,ml:5,mb:1 }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default AuthButton;
