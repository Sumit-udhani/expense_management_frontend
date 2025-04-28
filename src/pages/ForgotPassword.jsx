import axios from 'axios';
import React, { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material';
function ForgotPassword() {
     const [email,setEmail] = useState('')
     const [message, setMessage] = useState('');
     const [error, setError] = useState('');

     const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
             await axios.post('http://localhost:8085/auth/forgot-password',{email})
            setMessage('Password reset email sent');
        } catch (error) {
            setError(err.response?.data?.error || 'An error occurred');
        }
     }
  return  (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Forgot Password</Typography>
      {message && <Typography color="success">{message}</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
          Send Reset Link
        </Button>
      </form>
    </Box>
  );
}

export default ForgotPassword