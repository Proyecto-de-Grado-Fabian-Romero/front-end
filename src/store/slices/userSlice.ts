import { UserState } from "@/types/Users";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState | null>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return {};
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
