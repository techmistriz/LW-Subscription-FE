import { createSlice } from "@reduxjs/toolkit";

type ResetState = {
  loading: boolean;
  success: string | null;
  error: string | null;
};

const initialState: ResetState = {
  loading: false,
  success: null,
  error: null,
};

const resetSlice = createSlice({
  name: "reset",
  initialState,
  reducers: {
    resetStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    resetSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload;
    },
    resetFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearResetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  resetStart,
  resetSuccess,
  resetFail,
  clearResetState,
} = resetSlice.actions;

export default resetSlice.reducer;