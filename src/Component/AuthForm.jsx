import React from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import Dropdown from './ReusableDropdown';

export default function AuthForm({
  fields,
  buttonLabel,
  isLoading,
  error,
  footer,
  formik,
  ...props
}) {
  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        {fields.map((field) => {
          if (field.type === 'dropdown') {
            return (
              <Dropdown
                key={field.name}
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={(value) => formik.setFieldValue(field.name, value)}

                onBlur={formik.handleBlur}
                options={field.options}
                error={formik.errors[field.name]}
                touched={formik.touched[field.name]}
              />
            );
          } else if (field.type === 'file') {
            return (
              <TextField
                key={field.name}
                type="file"
                name={field.name}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                onChange={(event) =>
                  formik.setFieldValue(field.name, event.currentTarget.files[0])
                }
                onBlur={formik.handleBlur}
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
              />
            );
          } else {
            return (
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
            );
          }
        })}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, position: 'relative' }}
          {...props}
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
