import { Outlet, useLocation } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import Layout from "./Layout"

const LayoutWrapper = ({setLoggedIn}) =>{
    const location = useLocation()
    const logout = useLogout(setLoggedIn)
    const isAdmin = location.pathname.startsWith('/admin')
    const role = localStorage.getItem('role')
    const title = isAdmin? "Admin Dashboard" : "Employee Dashboard";

    const menuItems = isAdmin ?
    [
        { label: "Dashboard", path: "/admin" },
        { label: "All Users", path: "/admin/dashboard" },
    ]:
    [
        { label: "Dashboard", path: "/welcome" },
        { label: "Expenses", path: "/welcome/expenses-list" },
        { label: "Overall Budget Status", path: "/welcome/budget-status" },
    ]
    return (
        <Layout title={title} menuItems={menuItems}  onLogout={logout} userRole={role} >
            <Outlet/>
        </Layout>
    )
}
export default LayoutWrapper