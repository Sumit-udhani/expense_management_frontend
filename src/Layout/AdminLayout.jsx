import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import AuthButton from "../Component/AuthButton";
import useLogout from "../hooks/useLogout";

const drawerWidth = 240;

const AdminLayout = ({ children, setLoggedIn }) => {
  const logout = useLogout(setLoggedIn);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          
        }}
      >
        <Toolbar sx={{ position: 'relative', minHeight: 64 }}>
          <Typography
            variant="h6"
            color="#F8FAFC"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Admin Dashboard
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <AuthButton label="Logout" onClick={logout} />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", textAlign: "center" }}
          >
            Admin Menu
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "divider" }} />
        <List>
          {[
            { label: "Dashboard", path: "/welcomeAdmin" },
            { label: "All Users", path: "/admin" },
        
          ].map((item) => (
            <ListItem disablePadding key={item.label}>
              <ListItemButton component={Link} to={item.path}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ borderColor: "divider", my: 1 }} />
        
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
