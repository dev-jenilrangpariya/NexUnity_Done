import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: JSON.parse(sessionStorage.getItem("user")) ? true : false,
    userData: JSON.parse(sessionStorage.getItem("user")) || null,
    token: JSON.parse(sessionStorage.getItem("token")) || null,
    role: null,  
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    logout: (state, action) => {
      state.userData = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const selectUserData = (state) => state.auth.userData;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectRole = (state) => state.auth.role;
export const { login, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
