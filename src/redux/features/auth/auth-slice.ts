import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponseType } from '~/typings/types';

const initialState: LoginResponseType = { user_id: 0 };

// Save user authentication data.
export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<LoginResponseType>) => {
      state.user_id = action.payload.user_id;
    },
    clearAuth: () => initialState,
  },
});

const { clearAuth, setAuth } = auth.actions;
export { clearAuth, setAuth };
