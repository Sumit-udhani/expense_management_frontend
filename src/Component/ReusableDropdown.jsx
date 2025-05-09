import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const Dropdown = ({ label, name, value, onChange, onBlur, options, error, touched }) => {
 
  const handleChange = (e) => {
    const val = e.target.value === '' ? null : e.target.value;
    onChange(val);
  };
  
  
  return (
    <FormControl fullWidth margin="normal" error={touched && Boolean(error)}>
      <InputLabel>{label}</InputLabel>
      <Select
      label={label}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      {options.map((option) => (
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
