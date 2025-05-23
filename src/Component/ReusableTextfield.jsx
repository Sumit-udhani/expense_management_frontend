import { Box, TextField } from "@mui/material";
import AuthButton from "./AuthButton";

const ReusableTextField = ({
  label,
  value,
  onChange,
  onKeyDown,
  disabled,
  inputRef,
  size = "small",
  type = "text",
  sx = {},
  fullWidth, // explicitly destructure so it's not in ...props
  ...props
}) => {
  if (type === "file") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onChange}
          disabled={disabled}
          style={{ display: "none" }}
          
        />
        <AuthButton
          label={value ? "Change Image" : "Choose Image"}
          onClick={() => inputRef?.current?.click()}
          variant="outlined"
          size={size}
          disabled={disabled}
        />
        <Box sx={{ fontSize: 14, color: "gray", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value?.name || ""}
        </Box>
      </Box>
    );
  }

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      size={size}
      variant="outlined"
      inputRef={inputRef}
      type={type}
      sx={sx}
      fullWidth={fullWidth} // explicitly pass it here
      {...props}
    />
  );
};

export default ReusableTextField;
