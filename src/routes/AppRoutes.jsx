import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Welcome from "../pages/Welcome";

const AppRoutes = ({ loggedIn, setLoggedIn,handleLogout }) => (
  <Routes>      
    <Route
      path="/"
      element={<Navigate to={loggedIn ? "/welcome" : "/signup"} replace />}
    />
    <Route
      path="/signup"
      element={
        !loggedIn ? <Signup /> : <Navigate to="/welcome" replace />
      }
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
      element={!loggedIn ? <ForgotPassword /> : <Navigate to="/welcome" replace />}
    />
    <Route
      path="/reset-password"
      element={!loggedIn ? <ResetPassword /> : <Navigate to="/welcome" replace />}
    />
    <Route
      path="/welcome"
      element={loggedIn ? <Welcome  handleLogout={handleLogout}/> : <Navigate to="/login" replace />}
    />
    <Route path="*" element={<div style={{textAlign:'center',fontSize:'30px'}}>Page not found</div>} />
  </Routes>
);

export default AppRoutes;
