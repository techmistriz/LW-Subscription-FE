import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import {
  getProfile,
  loginUser as loginApi,
  logoutApi,
} from "@/lib/api/auth/auth";
import { setSubscription, Subscription } from "./subscriptionSlice";

/* ---------------- USER TYPE ---------------- */
interface User {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  contact: string;
  address: string;
  active_subscription_id?: number;
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

/* ---------------- HELPER FUNCTION TO FORMAT SUBSCRIPTION ---------------- */
const formatSubscription = (subscription: any): Subscription | undefined => {
  if (!subscription) return undefined;

  return {
    id: subscription.id,
    plan_id: subscription.membership_plan_id,
    name: subscription.plan?.name || "",
    amount: Number(subscription.plan?.price || 0),
    total_amount: Number(subscription.total_amount || 0),
    subtotal_amount: Number(subscription.subtotal_amount || 0),
    tax_amount: Number(subscription.tax_amount || 0),
    tax_percent: Number(subscription.tax_percent || 0),
    status: subscription.status,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    duration_value: subscription.plan?.duration_value,
    duration_unit: subscription.plan?.duration_unit,
    purchase_type: subscription.purchase_type,
    features: subscription.plan?.feature,
    is_trial: String(subscription.plan?.is_trial ?? ""),
    tag: subscription.plan?.tag,
    next_subscription_id: subscription.next_subscription_id,
    previous_subscription_id: subscription.previous_subscription_id,
    plan: subscription.plan,
    created_at: subscription.created_at,
  };
};
/* ---------------- LOGIN THUNK ---------------- */
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

      // Save auth data
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      sessionStorage.setItem("token", token);

      return {
        token,
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Login failed");
    }
  },
);

/* ---------------- PROFILE ---------------- */
export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getProfile();

      const user = res.data.user;
      const subscription = res.data.subscription;
      const nextSubscriptions = res.data.next_subscriptions || [];

      dispatch(
        setSubscription({
          subscription: subscription
            ? formatSubscription(subscription)
            : undefined,

          next_subscriptions: nextSubscriptions
            .map((sub: any) => formatSubscription(sub))
            .filter(Boolean) as Subscription[],
        }),
      );

      sessionStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch profile");
    }
  },
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

      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      state.isInitialized = true;
    },

    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      sessionStorage.setItem("token", action.payload.token);

      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${action.payload.token}`;
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

      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
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
