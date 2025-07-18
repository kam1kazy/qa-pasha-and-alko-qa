import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from './user.types';

const initialState: IUser = {
  id: '',
  name: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      if (state) {
        state.id = action.payload.id;
        state.email = action.payload.email;
      }
    },
    clearUser(state) {
      state.id = initialState.id;
      state.email = initialState.email;
      state.password = initialState.password;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
