import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "username",
  initialState: {
    userData: null,
  },
  reducers: {
    setUsersData: (state, action) => {
      state.userData = (action.payload);
    },
  },
});

export const { setUsersData } = userSlice.actions;
export default userSlice.reducer;
