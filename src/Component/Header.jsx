import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
const Header = ({ title, onLogout, isMobile, onMenuClick,userRole }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const navigate = useNavigate();

  const handleProfile = () => {
    handleMenuClose();
    navigate("/welcome/profile")
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ position: "relative", minHeight: 64 }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          color="#F8FAFC"
          sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        >
          {title}
        </Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <IconButton onClick={handleMenuOpen} size="large">
            <AccountCircle sx={{ color: "#F8FAFC" }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {userRole !== "Admin" && (
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
          )}
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
