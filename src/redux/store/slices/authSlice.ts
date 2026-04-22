import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { loginUser as loginApi, logoutApi } from "@/lib/auth/auth";

/* ================= TYPES ================= */

interface Plan {
  id: number;
  name: string;
  price: number;
  duration_value: number;
  duration_unit: string;
}

interface ActiveSubscription {
  id: number;
  plan_id: number;
  status: string;
  start_date?: string;
  end_date?: string;
  expires_at?: string;
  purchase_type?: string;
  plan?: Plan; //  IMPORTANT
}

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;

  //  FIX (this was missing)
  active_subscription?: ActiveSubscription;
}

interface Subscription {
  id?: number;
  plan_id?: number;
  name?: string;
  amount?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration_value?: number;
  duration_unit?: string;
  purchase_type?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

/* ================= INITIAL ================= */

const initialState: AuthState = {
  user: null,
  token: null,
  subscription: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

/* ================= THUNKS ================= */

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await loginApi(email, password);

      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (!token || !user) throw new Error("Invalid login response");

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return { user, token };
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {}

  sessionStorage.clear();
  delete axiosInstance.defaults.headers.common["Authorization"];

  return true;
});

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOAD USER + SUBSCRIPTION FROM STORAGE
    loadUserFromStorage: (state) => {
      const storedUser = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");
      const subscription = sessionStorage.getItem("subscription");

      if (storedUser && token) {
        state.user = JSON.parse(storedUser);
        state.token = token;
        state.isAuthenticated = true;

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      if (subscription) {
        state.subscription = JSON.parse(subscription);
      }

      state.isInitialized = true; //  important for AuthGate
    },

    // SET USER (register / payment flow)
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

    // SET SUBSCRIPTION
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
      sessionStorage.setItem("subscription", JSON.stringify(action.payload));
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
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.subscription = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

/* ================= EXPORTS ================= */

export const {
  loadUserFromStorage,
  setSubscription,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;