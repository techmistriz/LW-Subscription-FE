// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { logoutApi } from "@/lib/auth/auth";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

//LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { user, token }: { user: User; token: string },
    { rejectWithValue }
  ) => {
    try {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return { user, token };
    } catch {
      return rejectWithValue("Login failed");
    }
  }
);

//LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {}

  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");

  delete axiosInstance.defaults.headers.common["Authorization"];

  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUserFromStorage: (state) => {
      const storedUser = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");

      if (storedUser && token) {
        state.user = JSON.parse(storedUser);
        state.token = token;
        state.isAuthenticated = true;

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;