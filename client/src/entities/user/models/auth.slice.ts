import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken, setUser, logout, updateAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
