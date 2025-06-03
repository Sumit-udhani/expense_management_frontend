import { useEffect, useState } from "react";

import { BrowserRouter, useNavigate } from "react-router-dom";
import Header from "./Component/Header";
import AppRoutes from "./routes/AppRoutes";
import AppNavigator from "./Component/AppNavigator";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/features/auth/authSlice";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch()
  useEffect(()=>{
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      if (token && role) {
          dispatch(loginSuccess( { token, role, user:null }))
      }
  },[dispatch])
 
  return (
    <BrowserRouter>
      <AppNavigator setLoggedIn={setLoggedIn} />
      <AppRoutes
      />
    </BrowserRouter>
  );
}

export default App;
