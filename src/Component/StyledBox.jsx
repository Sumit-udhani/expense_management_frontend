import React from "react";
import { Box, Paper } from "@mui/material";

const StyledBox = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: "8px",
        border: "1px solid",
        backgroundColor: "transparent",
        color: "#f9fafb",
        width: "100%",
        overflow: "hidden",
        height: "90px",
        ...sx, 
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default StyledBox;
