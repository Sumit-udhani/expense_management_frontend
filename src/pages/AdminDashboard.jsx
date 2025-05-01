import { useEffect, useState } from "react";
import api from "../api/axiosInterceptor";
import ReusableTable from "../Component/ReusableTable";
import AuthButton from "../Component/AuthButton";

const AdminDashboard = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);

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

  return (
    <>
      <AuthButton label="Log Out" onClick={handleLogout} />
      <ReusableTable
        title="All Users"
        columns={["ID", "Name", "Email", "Role", "Status"]}
        rows={users}
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
    </>
  );
};

export default AdminDashboard;
