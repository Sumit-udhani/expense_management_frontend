import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Layout from "./Layout";
import api from "../api/axiosInterceptor"; // adjust path as needed
import { useParams } from "react-router-dom";
const LayoutWrapper = () => {
  const location = useLocation();
  const logout = useLogout();
  const isAdmin = location.pathname.startsWith("/admin");
  const role = localStorage.getItem("role");
  const { id } = useParams();
  const title = isAdmin ? "Admin Dashboard" : "Employee Dashboard";

  const menuItems = isAdmin
    ? [
        { label: "Dashboard", path: "/admin" },
        { label: "All Users", path: "/admin/dashboard" },
      ]
    : [
        { label: "Dashboard", path: "/welcome" },
        { label: "Expenses", path: "/welcome/expenses-list" },
        { label: "Overall Budget Status", path: "/welcome/budget-status" },
      ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const handleMenuClick = () => {
    if (window.innerWidth < 960) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res =  await api.get(`/auth/me`)
        const user = res.data;
        setUserProfile({
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          mobileNo: user.UserProfile?.mobileNo || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Layout
      title={title}
      menuItems={menuItems}
      onLogout={logout}
      userRole={role}
      mobileOpen={mobileOpen}
      handleDrawerToggle={handleMenuClick}
      showTitleInSidebar={isSidebarOpen}
      isSidebarOpen={isSidebarOpen}
      userProfile={userProfile} 
    >
      <Outlet />
    </Layout>
  );
};

export default LayoutWrapper;
