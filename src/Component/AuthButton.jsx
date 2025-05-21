import { Button } from '@mui/material';
import React from 'react';

const AuthButton = ({
  label,
  onClick,
  variant = "contained",
  isLoading,
  size = "medium", 
  ...props
}) => {
  return (
    <Button
      type="button"
      variant={variant}
      color="primary"
      onClick={onClick}
      disabled={isLoading}
      size={size}
      sx={{ mt: 1, ml: 1, mb: 1, px: 2, py: 0.5 }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default AuthButton;
