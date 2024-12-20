import { createSlice } from "@reduxjs/toolkit";
import {
  loginGoogleAction,
  loginAction,
  registerAction,
  getProfileAction,
  logoutAction,
} from "../actions/authActions";
import { AuthState } from "@/types";

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  access_token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.access_token = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login Google Reducers
    builder.addCase(loginGoogleAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginGoogleAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
    });
    builder.addCase(loginGoogleAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
      state.error = action.payload as string;
    });
    // Login Reducers
    builder.addCase(loginAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
      state.error = action.payload as string;
    });

    // Register Reducers
    builder.addCase(registerAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
      state.error = action.payload as string;
    });

    // Get Profile Reducers
    builder.addCase(getProfileAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.access_token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(getProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload as string;
    });

    // Logout Reducers
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
      state.error = null;
    });
  },
});

export const { setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
