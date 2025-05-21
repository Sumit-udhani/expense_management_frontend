import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../Component/Header";
import SidebarLayout from "../Component/SidebarLayout";
import Footer from "../Component/Footer";

const Layout = ({ title, menuItems, onLogout, children,userRole}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <Header
        title={title}
        onLogout={onLogout}
        isMobile={isMobile}
        onMenuClick={handleDrawerToggle}
        userRole={userRole}
      />
      <SidebarLayout
        title={title}
        menuItems={menuItems}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      >
        <Box sx={{ minHeight: "calc(100vh - 64px - 48px)" }}>
          {children}
        </Box>
        <Footer />
      </SidebarLayout>
    </>
  );
};

export default Layout;
