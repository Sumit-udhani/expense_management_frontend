import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress , Stack } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "../Component/ReusableTable";

import ReusableModal from "../Component/ReusableModal";
import ReusableTextField from "../Component/ReusableTextfield";

import { useNavigate } from "react-router-dom";
import AuthButton from "../Component/AuthButton";
import Loader from "../Component/Loader";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const rowsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc",
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers(currentPage, searchTerm, sortConfig);
  }, [currentPage, searchTerm, sortConfig]);
  

  const fetchUsers = async (page, search = "", sort = sortConfig) => {
    try {
      const res = await api.get(`/admin/users`, {
        params: {
          page,
          search,
          sortColumn: sort.key.toLowerCase(),
          sortOrder: sort.direction,
        },
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSort = (column) => {
    const direction =
      sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });
    setCurrentPage(1); 
  };
  

  const toggleUserStatus = async () => {
    if (!selectedUser) return;
    setIsStatusUpdating(true);
    setLoadingUserId(selectedUser.id);
    try {
      await api.patch(`/admin/users/${selectedUser.id}/status`, {
        isActive: !selectedUser.isActive,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user status:", err);
    } finally {
      setIsStatusUpdating(false);
      setConfirmModalOpen(false);
      setSelectedUser(null);
      setLoadingUserId(null);
    }
  };



  
  if (loading) {
    return (
     <Loader/>
    );
  }
  const handleViewDetailsPage = (user) => {
    navigate(`/admin/users/${user.id}`);
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">All Users</Typography>
        <ReusableTextField
          label="Search by Name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>
      {
        users.length === 0?(
          <Typography mt={4} textAlign="center">
          No users found.
        </Typography>
        ):(

          <ReusableTable
            title=""
            columns={["ID", "Name", "Email", "Role", "Status", "Actions"]}
            rows={users}
            getRowData={(user) => [
              user.id,
              user.name,
              user.email,
              user.Role?.name || "N/A",
              user.isActive ? "Active" : "Inactive",
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
            actions={(user) => (
              <Box display="flex" gap={1}>
              <AuthButton
              label={user.isActive ? "Deactivate" : "Activate"}
              color={user.isActive ? "error" : "success"}
              isLoading={loadingUserId === user.id}
              onClick={() => {
                setSelectedUser(user);
                setConfirmModalOpen(true);
              }}
              variant="outlined"
              disabled={loading}
              size="small"  
            />
               <AuthButton
               label={"view"}
               color={"info"}
               size="small"
               onClick={() => handleViewDetailsPage(user)}
               variant="outlined"
               />
              </Box>
            )}
            
            
          />
        )
      }
      <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
    >
      <AuthButton
      label="Previous"
      variant="outlined"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1 || loading}
      sx={{ px: 2, py: 0.5, fontSize: "0.8rem", mt: 0, ml: 0, mb: 0 }}
    />
        <Typography variant="body2">
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <AuthButton
        label="Next"
        variant="outlined"
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={
          currentPage === totalPages || totalPages === 0 || loading
        }
        sx={{ px: 2, py: 0.5, fontSize: "0.8rem", mt: 0, ml: 0, mb: 0 }}
      />
      </Stack>


      <ReusableModal
        open={confirmModalOpen}
        handleClose={() => {
          setConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        title="Confirm Action"
      >
        <Typography mb={2}>
          Are you sure you want to{" "}
          {selectedUser?.isActive ? "deactivate" : "activate"}{" "}
          {selectedUser?.name}?
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
        <AuthButton
        label="Cancel"
        color="primary"
        variant="outlined"
        onClick={() => {
          setConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        sx={{ px: 2, py: 0.6, fontSize: "0.8rem", mt: 0, ml: 0, mb: 0 }}
      />
      <AuthButton
      label={selectedUser?.isActive ? "Deactivate" : "Activate"}
      color={selectedUser?.isActive ? "error" : "success"}
      onClick={toggleUserStatus}
      isLoading={isStatusUpdating}
      variant="outlined"
      sx={{ px: 2, py: 0.6, fontSize: "0.8rem", mt: 0, ml: 0, mb: 0 }}
    />
        </Box>
      </ReusableModal>
    </>
  );
};

export default AdminDashboard;
