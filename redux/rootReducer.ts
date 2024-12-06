import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loadingReducer from "./slices/loadingSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  settings: settingsReducer,
});

export default rootReducer;
