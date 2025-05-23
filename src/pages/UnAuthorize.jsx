import React from 'react'
import AuthButton from '../Component/AuthButton'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
export default function UnAuthorize() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role')
  return (
    <div>
    <h1 style={{ textAlign: 'center', fontSize: '24px', color: 'red' }}> Unauthorized Access</h1>
    <AuthButton label="Back to Dashboard" onClick={() => navigate(role === 'Admin'?'/admin':'/welcome')}/>
    </div>
  )
}
