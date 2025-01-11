
import { configureStore } from "@reduxjs/toolkit";
import httpMethodReducer from "./slices/httpMethodSlice";
import urlReducer from "./slices/URLSlice"
export const store = configureStore({
  reducer: {
    httpMethod: httpMethodReducer,
    url: urlReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
