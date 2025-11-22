import { configureStore } from "@reduxjs/toolkit";
import optionsReducer from "./slices/optionsSlice";
import userReducer from "./slices/userSlice";
import notificationsReducer from "./slices/notificationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    options: optionsReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
