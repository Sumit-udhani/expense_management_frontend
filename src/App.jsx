import { useEffect, useState } from "react";

import { BrowserRouter, useNavigate } from "react-router-dom";
import Header from "./Component/Header";
import AppRoutes from "./routes/AppRoutes";
import AppNavigator from "./Component/AppNavigator";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <AppNavigator setLoggedIn={setLoggedIn} />
      <AppRoutes
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;
