import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ReusableModal = ({ open, handleClose, title, children, maxWidth = 600 }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        overflow: 'auto',
        p: 2, // Padding around modal
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          width: '100%',
          maxWidth,
          borderRadius: 2,
          outline: 'none',
          maxHeight: '90vh', // Prevent overflow off screen
          overflowY: 'auto', // Scroll if content too long
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="modal-title" variant="h6">
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default ReusableModal;
