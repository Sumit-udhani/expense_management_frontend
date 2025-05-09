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
const AppRoutes = ({ loggedIn, setLoggedIn, handleLogout }) => (
  <Routes>
    <Route
      path="/"
      element={<Navigate to={!loggedIn && "/signup" } replace />}
    />
    <Route
      path="/signup"
      element={!loggedIn ? <Signup /> : <Navigate to="/welcome" replace />}
    />
    <Route
      path="/login"
      element={
        !loggedIn ? (
          <Login setLoggedIn={setLoggedIn} />
        ) : (
          <Navigate to="/welcome" replace />
        )
      }
    />
    <Route
      path="/verify-email"
      element={!loggedIn ? <VerifyEmail /> : <Navigate to="/welcome" replace />}
    />
    <Route
      path="/forgot-password"
      element={
        !loggedIn ? <ForgotPassword /> : <Navigate to="/welcome" replace />
      }
    />
    <Route
      path="/reset-password"
      element={
        !loggedIn ? <ResetPassword /> : <Navigate to="/welcome" replace />
      }
    />
    <Route
      path="/welcome"
      element={
        loggedIn ? (
          <EmployeeLayout setLoggedIn={setLoggedIn}>
          <EmployeeDashboard/>
          </EmployeeLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute roleRequired="Admin">
        <AdminLayout setLoggedIn={setLoggedIn} >
        <AdminDashboard setLoggedIn={setLoggedIn} />
        </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<UnAuthorize />} />
    <Route
      path="/create-category"
      element={
        <EmployeeLayout setLoggedIn={setLoggedIn}>
          <CreateCategory />
        </EmployeeLayout>
      }
    />
    <Route 
    path="/add-expense"
    element={
      <EmployeeLayout setLoggedIn={setLoggedIn}>
        <AddExpense/>
      </EmployeeLayout>
    }
    />
    <Route
    path="/expenses-list"
    element ={
      <EmployeeLayout setLoggedIn={setLoggedIn}>
      <MyExpenses/>
      </EmployeeLayout>
    }
    />
    <Route 
    path="/admin-expenses-list"
    element ={
      <AdminLayout setLoggedIn={setLoggedIn}>
      <AllUsersExpense/>
      </AdminLayout>
    }
    />
    <Route
    path="/welcomeAdmin"
    element={
        loggedIn ?(
          <AdminLayout setLoggedIn={setLoggedIn}>
          <WelcomeAdmin/>
          </AdminLayout>
        ):(
          <Navigate to="/login" replace />
        )
     
    }
    />
    <Route 
    path="/set-budget"
    element={
      <EmployeeLayout setLoggedIn={setLoggedIn}>
      <SetBudgetPage/>
      </EmployeeLayout>
    }
    />
    <Route 
    path="/budget-status-category"
    element ={
      <EmployeeLayout  setLoggedIn={setLoggedIn} >
      <BudgetStatus/>
      </EmployeeLayout>
    }
    />
    <Route 
    path="/budget-status"
    element ={
      <EmployeeLayout  setLoggedIn={setLoggedIn} >
     <OverallBudgetStatus/>
      </EmployeeLayout>
    }
    />
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
