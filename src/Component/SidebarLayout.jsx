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
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
const SidebarLayout = ({
  title,
  menuItems,
  mobileOpen,
  handleDrawerToggle,
  isSidebarOpen,
  children
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = isSidebarOpen ? 240 : 60;

  const drawerContent = (
    <Box>
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarOpen ? "space-between" : "center",
          px: 2,
          py: 2,
        }}
      >
        {isSidebarOpen && (
          <Typography variant="h6" sx={{ color: "white" }}>
            {title}
          </Typography>
        )}
        {!isMobile &&(

          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
        {isMobile &&(
          <IconButton onClick={handleDrawerToggle}>
          <CloseIcon/>
        </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "divider" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText
                primary={item.label}
                sx={{ display: isSidebarOpen ? "block" : "none" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flex: 1, minHeight: 0, backgroundColor: "background.default" }}>
 
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "background.paper",
              color: "text.primary",
              boxSizing: "border-box",
              zIndex: (theme) => theme.zIndex.appBar + 1,
            },
          }}
        >
          {drawerContent}
        </Drawer>
  
        
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "background.paper",
              color: "text.primary",
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
 
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        mt:8, 
        minHeight: 0, 
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
    
    </Box>
  );
  
};
export default SidebarLayout