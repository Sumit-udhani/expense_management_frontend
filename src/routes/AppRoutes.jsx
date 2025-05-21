import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../Component/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import UnAuthorize from "../pages/UnAuthorize";
import CreateCategory from "../Component/CategoryForm";
import AddExpense from "../Component/AddExpense";
import MyExpenses from "../Component/MyExpenses";
import AllUsersExpense from "../Component/AllUsersExpense";
import WelcomeAdmin from "../pages/WelcomeAdmin";
import SetBudgetPage from "../pages/SetBudgetPage";
import BudgetStatus from "../pages/BudgetStatus";
import OverallBudgetStatus from "../pages/OverallBudgetStatus";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import UserDetailsPage from "../pages/UserDetailsPage";
import LayoutWrapper from "../Layout/LayoutWrapper";

const AppRoutes = ({ loggedIn, setLoggedIn }) => (
  <Routes>
    {/* Public routes */}
    <Route
      path="/"
      element={
        !loggedIn ? <Navigate to="/signup" replace /> : <Navigate to="/welcome" replace />
      }
    />
    <Route path="/signup" element={!loggedIn ? <Signup /> : <Navigate to="/welcome" replace />} />
    <Route path="/login" element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/welcome" replace />} />
    <Route path="/verify-email" element={!loggedIn ? <VerifyEmail /> : <Navigate to="/welcome" replace />} />
    <Route path="/forgot-password" element={!loggedIn ? <ForgotPassword /> : <Navigate to="/welcome" replace />} />
    <Route path="/reset-password" element={!loggedIn ? <ResetPassword /> : <Navigate to="/welcome" replace />} />

   
    {loggedIn && (
      <Route element={<LayoutWrapper setLoggedIn={setLoggedIn} />}>
        <Route path="/welcome" element={<EmployeeDashboard />} />
        <Route path="/welcome/create-category" element={<CreateCategory />} />
        <Route path="/welcome/add-expense" element={<AddExpense />} />
        <Route path="/welcome/expenses-list" element={<MyExpenses />} />
        <Route path="/welcome/set-budget" element={<SetBudgetPage />} />
        <Route path="/welcome/budget-status-category" element={<BudgetStatus />} />
        <Route path="/welcome/budget-status" element={<OverallBudgetStatus />} />
        <Route path="/welcome/profile" element={<ProfilePage />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="Admin">
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<WelcomeAdmin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
        </Route>
      </Route>
    )}

    {/* Unauthorized route */}
    <Route path="/unauthorized" element={<UnAuthorize />} />

    {/* 404 fallback */}
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
