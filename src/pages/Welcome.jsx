import React from 'react'
import AuthButton from '../Component/AuthButton'

function Welcome({handleLogout}) {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems: 'center',
    }}>
    <h1 style={{textAlign:'center'}}>Welcome on Expense manager</h1>
    <AuthButton label="Log Out" onClick={handleLogout} />
    </div>
  )
}

export default Welcome