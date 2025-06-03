import { createSlice } from '@reduxjs/toolkit';
const token = localStorage.getItem("token")
const role = localStorage.getItem('role')

const initialState = {
  token: token||null,
  role: role||null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   loginSuccess: (state, action) => {
      const { token, role, user } = action.payload;
      state.token = token;
      state.role = role;
      state.user = user;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;    
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
