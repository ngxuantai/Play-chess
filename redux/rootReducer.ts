import { combineReducers } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  loading: loadingReducer,
  settings: settingsReducer,
});

export default rootReducer;
