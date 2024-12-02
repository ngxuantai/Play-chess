import { combineReducers } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";

const rootReducer = combineReducers({
  loading: loadingReducer,
});

export default rootReducer;
