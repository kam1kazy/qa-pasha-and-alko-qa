import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
  },
});

// Селекторы
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectRefreshing = (state: { auth: AuthState }) =>
  state.auth.isRefreshing;

export const { setAccessToken, logout, setRefreshing } = authSlice.actions;
export default authSlice.reducer;
