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
  fullWidth,
  context, 
  ...props
}) => {
  if (type === "file") {
    const isAddExpenseForm = context === 'addExpense';
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: fullWidth ? "100%" : "auto",
          gap: 1,
          ...sx,
        }}
      >
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
          fullWidth
          sx={{
            width: "100%",
            ...(isAddExpenseForm && {
              minHeight:
                size === "large"
                  ? "56px"
                  : size === "medium"
                  ? "40px"
                  : "36px",
            }),
          }}
        />
        <Box
          sx={{
            fontSize: 14,
            color: "gray",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
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
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export default ReusableTextField;
