import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import api from "../api/axiosInterceptor";
import ReusableTable from "../Component/ReusableTable";
import AuthButton from "../Component/AuthButton";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await api.delete(`/admin/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
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
        columns={["ID", "Name", "Email", "Role", "Status"]}
        rows={paginatedUsers}
        getRowData={(user) => [
          user.id,
          user.name,
          user.email,
          user.Role?.name || "N/A",
          user.isActive ? "Active" : "Inactive",
        ]}
        actions={[
          {
            label: "Delete",
            onClick: (user) => deleteUser(user.id),
            Component: AuthButton,
          },
        ]}
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
    </>
  );
};

export default AdminDashboard;
