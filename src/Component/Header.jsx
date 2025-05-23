import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const Header = ({
  title,
  onLogout,
  userRole,
  isSidebarOpen,
  onMenuClick,
  profile,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => {
    handleMenuClose();
    navigate("/welcome/profile");
  };

  const imageUrl = profile?.image
    ? `http://localhost:8085/files/${encodeURIComponent(profile.image)}`
    : null;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        height: 64,
        width: {
          xs: "100%",
          md: isSidebarOpen ? "calc(100% - 240px)" : "95%",
        },
        transition: "width 0.3s",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h6"
          color="white"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            userSelect: "none",
            display: { xs: "block", md: isSidebarOpen ? "none" : "block" },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ ml: "auto" }}>
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            aria-label="account"
          >
            <Avatar src={imageUrl} alt="Profile" sx={{ width: 36, height: 36 }}>
              {!imageUrl && profile?.name
                ? profile.name[0].toUpperCase()
                : null}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
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
