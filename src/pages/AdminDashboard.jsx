import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField,CircularProgress } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "../Component/ReusableTable";
import TableActionButton from "../Component/TableActionButton";
import ReusableModal from "../Component/ReusableModal";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: 'Name', direction: 'asc' });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null); 
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const key = sortConfig.key;

    const getValue = (user) => {
      switch (key) {
        case 'ID': return user.id;
        case 'Name': return user.name.toLowerCase();
        case 'Email': return user.email.toLowerCase();
        case 'Role': return user.Role?.name?.toLowerCase() || '';
        case 'Status': return user.isActive ? 'Active' : 'Inactive';
        default: return '';
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">All Users</Typography>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>

      <ReusableTable
        title=""
        columns={["ID", "Name", "Email", "Role", "Status", "Actions"]}
        rows={paginatedUsers}
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
          <TableActionButton
            label={user.isActive ? "Deactivate" : "Activate"}
            color={user.isActive ? "error" : "success"}
            isLoading={loadingUserId === user.id} 
            onClick={() => {
              setSelectedUser(user);
              setConfirmModalOpen(true);
            }}
          />
        )}
      />

      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Previous
        </Button>
        <Typography variant="body2">
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          sx={{ ml: 2 }}
        >
          Next
        </Button>
      </Box>

      <ReusableModal
        open={confirmModalOpen}
        handleClose={() => {
          setConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        title="Confirm Action"
      >
        <Typography mb={2}>
          Are you sure you want to {selectedUser?.isActive ? "deactivate" : "activate"}{" "}
          {selectedUser?.name}?
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              setConfirmModalOpen(false);
              setSelectedUser(null);
            }}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
          variant="contained"
          color={selectedUser?.isActive ? "error" : "success"}
          onClick={toggleUserStatus}
          disabled={isStatusUpdating}
          sx={{ position: 'relative', minWidth: 100 }}
        >
          {isStatusUpdating ? (
            <>
              <CircularProgress
                size={20}
                color="inherit"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <span style={{ opacity: 0 }}>
                {selectedUser?.isActive ? "Deactivate" : "Activate"}
              </span>
            </>
          ) : (
            selectedUser?.isActive ? "Deactivate" : "Activate"
          )}
        </Button>
        
        </Box>
      </ReusableModal>
    </>
  );
};

export default AdminDashboard;
