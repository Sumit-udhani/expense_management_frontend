// ReusableDropdown.jsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const Dropdown = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  touched,
  sx={}
}) => {
  const showError = touched && Boolean(error);

  return (
    <FormControl fullWidth margin="normal" error={showError}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        sx={sx}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {showError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;
