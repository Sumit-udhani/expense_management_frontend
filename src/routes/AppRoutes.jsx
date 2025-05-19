import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import ProtectedRoute from "../Component/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import UnAuthorize from "../pages/UnAuthorize";
import EmployeeLayout from "../Layout/EmployeeLayout";
import CreateCategory from "../Component/CategoryForm";
import AddExpense from "../Component/AddExpense";
import MyExpenses from "../Component/MyExpenses";
import AdminLayout from "../Layout/AdminLayout";
import AllUsersExpense from "../Component/AllUsersExpense";
import WelcomeAdmin from "../pages/WelcomeAdmin";
import BudgetPage from "../pages/SetBudgetPage";
import SetBudgetForm from "../Component/setBudgetForm";
import BudgetStatus from "../pages/BudgetStatus";
import SetBudgetPage from "../pages/SetBudgetPage";
import OverallBudgetStatus from "../pages/OverallBudgetStatus";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import UserDetailsPage from "../pages/UserDetailsPage";
const AppRoutes = ({ loggedIn, setLoggedIn, handleLogout }) => (
  <Routes>
  <Route
  path="/"
  element={!loggedIn ? <Navigate to="/signup" replace /> : <Navigate to="/welcome" replace />}
/>

<Route
  path="/signup"
  element={!loggedIn ? <Signup /> : <Navigate to="/welcome" replace />}
/>

<Route
  path="/login"
  element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/welcome" replace />}
/>

<Route
  path="/verify-email"
  element={!loggedIn ? <VerifyEmail /> : <Navigate to="/welcome" replace />}
/>

<Route
  path="/forgot-password"
  element={!loggedIn ? <ForgotPassword /> : <Navigate to="/welcome" replace />}
/>

<Route
  path="/reset-password"
  element={!loggedIn ? <ResetPassword /> : <Navigate to="/welcome" replace />}
/>
{loggedIn && (
  <Route path="/welcome" element={<EmployeeLayout setLoggedIn={setLoggedIn} />}>
    <Route index element={<EmployeeDashboard />} />
    <Route path="create-category" element={<CreateCategory />} />
    <Route path="add-expense" element={<AddExpense />} />
    <Route path="expenses-list" element={<MyExpenses />} />
    <Route path="set-budget" element={<SetBudgetPage />} />
    <Route path="budget-status-category" element={<BudgetStatus />} />
    <Route path="budget-status" element={<OverallBudgetStatus />} />
  </Route>
)}

{/* ✅ ADMIN ROUTES */}
<Route
  path="/admin"
  element={
    <ProtectedRoute roleRequired="Admin">
      <AdminLayout setLoggedIn={setLoggedIn}/>
        
    
    </ProtectedRoute>
  }
>
<Route index element={<WelcomeAdmin/>} />
<Route path="admin" element={<AdminDashboard/>} />
<Route path="users/:id" element={ <UserDetailsPage />} />

</Route>

<Route path="/unauthorized" element={<UnAuthorize />} />

{/* Catch-all 404 */}
<Route
  path="*"
  element={
    <div style={{ textAlign: "center", fontSize: "30px" }}>
      Page not found
    </div>
  }
/>

  </Routes>
);

export default AppRoutes;
