import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../Component/Header";
import SidebarLayout from "../Component/SidebarLayout";
import Footer from "../Component/Footer";

const Layout = ({
  title,
  menuItems,
  onLogout,
  children,
  userRole,
  mobileOpen,
  handleDrawerToggle,
  showTitleInSidebar,
  isSidebarOpen,
  userProfile,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        title={title}
        onLogout={onLogout}
        isMobile={isMobile}
        onMenuClick={handleDrawerToggle}
        userRole={userRole}
        showTitleInSidebar={showTitleInSidebar}
        isSidebarOpen={isSidebarOpen}
        profile={userProfile}
      />

      {/* MAIN CONTENT WRAPPER */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SidebarLayout
          title={title}
          menuItems={menuItems}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          showTitleInSidebar={showTitleInSidebar}
          isSidebarOpen={isSidebarOpen}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              minHeight: 0, 
            }}
          >
            {children}
          </Box>
        </SidebarLayout>
      </Box>

     
      <Footer />
    </Box>
  );
};

export default Layout;
