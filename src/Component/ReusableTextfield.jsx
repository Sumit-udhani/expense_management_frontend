import React from "react";
import { TextField } from "@mui/material";

const ReusableTextField = ({ label, value, onChange, placeholder, size = "small", sx = {}, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      size={size}
      sx={{
        minWidth: "250px",
        ...sx,
      }}
      {...props}
    />
  );
};

export default ReusableTextField;
