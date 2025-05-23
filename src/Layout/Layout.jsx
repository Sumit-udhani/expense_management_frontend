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
  userProfile
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden" }}>
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
      <SidebarLayout
        title={title}
        menuItems={menuItems}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        showTitleInSidebar={showTitleInSidebar}
        isSidebarOpen={isSidebarOpen} // ✅ pass to sidebar too
      >
        <Box sx={{ flex: 1, overflowY: "hidden" }}>
          {children}
        </Box>
        <Footer />
      </SidebarLayout>
    </Box>
  );
};

export default Layout;
