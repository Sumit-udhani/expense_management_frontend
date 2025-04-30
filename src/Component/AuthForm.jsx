import React from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

export default function     AuthForm({
  fields,
  buttonLabel,
  isLoading,
  error,
  footer,
  formik
}) {
  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || 'text'}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            fullWidth
            margin="normal"
          
          />
        ))}
        <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2, position: 'relative' }}
      >
        {isLoading ? (
          <>
            <CircularProgress
              size={24}
              color="inherit"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
            <span style={{ opacity: 0 }}>{buttonLabel}</span>
          </>
        ) : (
          buttonLabel
        )}
      </Button>
      
        {footer}
      </Box>
    </>
  );
}
