import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
      token: null,
    },
    reducers: {
      setUserToken: (state, action) => {
        state.token = action.payload;
      },
      logout: (state) => {
        state.token = null;
        // state = { token: null }
      },
    },
  });
  
  export const { setUserToken, logout } = userSlice.actions;
  
  export default userSlice.reducer;