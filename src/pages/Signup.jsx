import React, { useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios'
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Signup() {
   const [form,setForm] =  useState({name:'',email:'',password:''})
   const [error,setError] = useState('')
   const navigate = useNavigate()
   const [isLoading, setIsLoading] = useState(false)
   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = async (e) =>{
    e.preventDefault()
    setIsLoading(true)
    try {
        
        const response = await axios.post('http://localhost:8085/auth/signup',form)
        
        alert('Email sent Successfully')
    } catch (error) {
        setError(err.response?.data?.message || 'An error occurred');
    }
  }
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Signup</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
          Sign Up
        </Button>
        <Link to={'/login'}><p>Already have an accont? go to Login</p></Link>
      </form>
    </Box>
  );
}
