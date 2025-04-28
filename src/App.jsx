import { useEffect, useState } from 'react'


import { Route, Routes,BrowserRouter,Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
 import Login from './pages/Login'
 import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
function App() {



  
  return (
    <BrowserRouter> 
      <Routes>
      <Route path='/' element={<Navigate to="/signup" />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/login" element={<Login /> } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
