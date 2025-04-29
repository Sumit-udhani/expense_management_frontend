import { useEffect, useState } from 'react'


import {BrowserRouter, } from 'react-router-dom'
import Header from './Component/Header'
import AppRoutes from './routes/AppRoutes'
function App() {

  return (
  

    <BrowserRouter>
     
      <AppRoutes />
    </BrowserRouter>
   
  )
}

export default App
