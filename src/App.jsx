import { useState } from 'react'


import { Route, Routes,BrowserRouter,Navigate } from 'react-router-dom'
import Signup from './pages/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter> 
      <Routes>
      <Route path='/' element={<Navigate to="/signup" />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
