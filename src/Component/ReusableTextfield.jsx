import { TextField } from "@mui/material";
const ReusableTextField = ({ label, value, onChange, onKeyDown, disabled,inputRef ,size="small"}) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    disabled={disabled}
   size ={size}
    variant="outlined"
    inputRef={inputRef}
  />
);

export default ReusableTextField;
