import { createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "../slices/loadingSlice";

export const createLoadingThunk = <T>(
  actionType: string,
  asyncFunction: (arg: T) => Promise<any>
) => {
  return createAsyncThunk(actionType, async (arg: T, { dispatch }) => {
    try {
      dispatch(startLoading(`Loading ${actionType}`));
      const result = await asyncFunction(arg);
      return result;
    } finally {
      dispatch(stopLoading());
    }
  });
};
