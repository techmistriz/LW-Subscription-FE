import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./authSlice";

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
  features?: string;
  is_trial?: string;
  tag?: string;
}

interface SubscriptionState {
  data: Subscription | null;
  isLoaded: boolean;
}

const initialState: SubscriptionState = {
  data: null,
  isLoaded: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.data = action.payload;

      sessionStorage.setItem(
        "subscription",
        JSON.stringify(action.payload)
      );
    },

    loadSubscriptionFromStorage: (state) => {
      const stored = sessionStorage.getItem("subscription");

      if (stored) {
        state.data = JSON.parse(stored);
      }

      state.isLoaded = true;
    },

    clearSubscription: (state) => {
      state.data = null;
      sessionStorage.removeItem("subscription");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.data = null;
      sessionStorage.removeItem("subscription");
    });
  },
});

export const {
  setSubscription,
  loadSubscriptionFromStorage,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;