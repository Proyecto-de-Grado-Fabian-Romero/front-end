import { configureStore } from "@reduxjs/toolkit";
import optionsReducer from "./slices/optionsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    options: optionsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
