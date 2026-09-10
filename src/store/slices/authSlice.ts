import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getProfile,
  loginUser as loginApi,
  logoutApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "@/lib/api/auth/auth";
import { storage } from "@/lib/storage";
import { setSubscription } from "./subscriptionSlice";
import { mapSubscription } from "@/types/mapSubscription";
import type { User } from "@/types";
import { ResetPasswordPayload } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  passwordReset: {
    loading: boolean;
    success: string | null;
    error: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  passwordReset: { loading: false, success: null, error: null },
};

/* ---------------- THUNKS ---------------- */

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await loginApi(email, password);
      const token = res?.token || res?.data?.token;

      if (!token) {
        throw new Error("Invalid login response");
      }

      storage.set("token", token);

      return { token };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getProfile();
      const { user, subscription, next_subscriptions = [] } = res.data;

      dispatch(
        setSubscription({
          subscription: subscription
            ? (mapSubscription(subscription) ?? undefined)
            : undefined,
          next_subscriptions: next_subscriptions
            .map(mapSubscription)
            .filter(Boolean),
        }),
      );

      storage.set("user", user);

      return user as User;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch profile";

      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {
    // logout should succeed client-side even if API call fails
  }

  storage.clearAuthData();

  return true;
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    const res = await forgotPasswordApi(email);

    if (!res?.status) {
      return rejectWithValue(res?.message || "Request failed");
    }

    return res.message as string;
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    const res = await resetPasswordApi(data);

    if (!res?.status) {
      return rejectWithValue(res?.message || "Reset failed");
    }

    return "Password updated successfully";
  },
);

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loadUserFromStorage: (state) => {
      const token = storage.get("token");

      if (!token) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        return;
      }

      const user = storage.get<User>("user", true);

      if (user) {
        state.user = user;
        state.isAuthenticated = true;
        state.token = token;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        storage.remove("token");
        storage.remove("user");
      }

      state.isInitialized = true;
    },

    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;

      storage.set("user", action.payload.user);
      storage.set("token", action.payload.token);
    },

    clearPasswordResetState: (state) => {
      state.passwordReset = {
        loading: false,
        success: null,
        error: null,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message || "Login failed";
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })

      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })

      .addCase(logoutUser.fulfilled, () => initialState)

      .addCase(forgotPassword.pending, (state) => {
        state.passwordReset = {
          loading: true,
          success: null,
          error: null,
        };
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.passwordReset = {
          loading: false,
          success: action.payload,
          error: null,
        };
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordReset = {
          loading: false,
          success: null,
          error:
            typeof action.payload === "string"
              ? action.payload
              : action.error.message || "Request failed",
        };
      })

      .addCase(resetPassword.pending, (state) => {
        state.passwordReset = {
          loading: true,
          success: null,
          error: null,
        };
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordReset = {
          loading: false,
          success: action.payload,
          error: null,
        };
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordReset = {
          loading: false,
          success: null,
          error:
            typeof action.payload === "string"
              ? action.payload
              : action.error.message || "Reset failed",
        };
      });
  },
});

export const { loadUserFromStorage, setUser, clearPasswordResetState } =
  authSlice.actions;

export default authSlice.reducer;
