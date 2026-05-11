import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { loginUser as loginApi, logoutApi } from "@/lib/api/auth/auth";
import { setSubscription } from "./subscriptionSlice";

/* ---------------- USER TYPE ---------------- */
interface User {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  contact: string;
  address: string;

  active_subscription?: any;
}

/* ---------------- STATE ---------------- */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

/* ---------------- LOGIN THUNK ---------------- */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await loginApi(email, password);

      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      /* ---------------- SUBSCRIPTION HANDLING ---------------- */
      let subscription = null;

      // 1. Try API
      try {
        const subRes = await axiosInstance.get("/user/subscription");
        subscription = subRes?.data?.data || null;
      } catch (err) {
        console.log("Subscription API failed");
      }

      // 2. Fallback: from login response (IMPORTANT FIX)
      if (!subscription) {
        subscription = res?.subscription || res?.data?.subscription;
      }

      // 3. Dispatch subscription if exists
      if (subscription) {
        dispatch(
          setSubscription({
            id: subscription.id,
            plan_id: subscription.membership_plan_id,
            name: subscription.plan?.name,
            amount: Number(subscription.plan?.price || 0),
            status: subscription.status,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            duration_value: subscription.plan?.duration_value,
            duration_unit: subscription.plan?.duration_unit,
            purchase_type: subscription.purchase_type,
            features: subscription.plan?.feature,
            is_trial: String(subscription.plan?.is_trial ?? ""),
            tag: subscription.plan?.tag,
          })
        );
      }

      /* ---------------- STORAGE ---------------- */
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      return { user, token };
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

/* ---------------- LOGOUT ---------------- */
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {}

  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("subscription");

  delete axiosInstance.defaults.headers.common["Authorization"];

  return true;
});

/* ---------------- SLICE ---------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUserFromStorage: (state) => {
      const user = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");

      if (!token) {
        state.isInitialized = true;
        return;
      }

      if (user) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }

      state.token = token;

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      state.isInitialized = true;
    },

    setUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      sessionStorage.setItem("token", action.payload.token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload.token}`;
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
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.isInitialized = true;
})

      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.isInitialized = true;
});
  },
});

export const { loadUserFromStorage, setUser } = authSlice.actions;
export default authSlice.reducer;