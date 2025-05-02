import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const Dropdown = ({ label, name, value, onChange, onBlur, options, error, touched }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={touched && Boolean(error)}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {touched && error && (
        <Typography color="error" variant="body2">{error}</Typography>
      )}
    </FormControl>
  );
};

export default Dropdown;
