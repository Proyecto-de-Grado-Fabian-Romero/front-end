import { UserState } from "@/types/Users";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<UserState | null>) {
      if (action.payload === null) {
        return {};
      }
      return { ...action.payload };
    },
    clearUser() {
      return {};
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
