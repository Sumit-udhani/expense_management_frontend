import { Button } from '@mui/material';
import React from 'react';

const PaginationButton = ({ label, onClick, disabled = false, sx = {}, ...props }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      sx={{
        minWidth: '80px',
        textTransform: 'none',
        padding: '4px 12px',
        fontSize: '0.875rem',
        ...sx,
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default PaginationButton;
