import { TextField } from "@mui/material";

const ReusableTextField = ({
  label,
  value,
  onChange,
  onKeyDown,
  disabled,
  inputRef,
  size = "small",
  type = "text",           
  ...props                
}) => (
  <TextField
    label={label}
    value={type === "file" ? undefined : value} 
    onChange={onChange}
    onKeyDown={onKeyDown}
    disabled={disabled}
    size={size}
    variant="outlined"
    inputRef={inputRef}
    type={type}
    InputLabelProps={type === "file" ? { shrink: true } : undefined}  
    {...props}
  />
);

export default ReusableTextField;
