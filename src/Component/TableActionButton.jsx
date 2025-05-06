import { Button, CircularProgress } from '@mui/material';
import React from 'react';

const TableActionButton = ({ label, isLoading, onClick, color = 'primary', ...props }) => {
  return (
    <Button
      variant="contained"
      size="small"
      color={color}
      onClick={onClick}
      disabled={isLoading}
      sx={{
        textTransform: 'none',
        fontSize: '0.75rem',
        padding: '4px 10px',
        minWidth: 'auto',
        position: 'relative',
        ...props.sx,
      }}
      {...props}
    >
      {isLoading && (
        <CircularProgress
          size={16}
          color="inherit"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <span style={{ opacity: isLoading ? 0 : 1 }}>{label}</span>
    </Button>
  );
};

export default TableActionButton;
