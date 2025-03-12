import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contactReducer from "./slices/contactSlice";
import profileReducer from "./slices/profileSlice"; // 新增
import { api } from "./api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    profile: profileReducer, // 添加profileReducer
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
