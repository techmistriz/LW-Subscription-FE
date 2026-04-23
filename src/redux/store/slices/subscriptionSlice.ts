import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface SubscriptionState {
  data: Subscription | null;
}

const initialState: SubscriptionState = {
  data: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.data = action.payload;

      // optional: persist
      sessionStorage.setItem("subscription", JSON.stringify(action.payload));
    },

    loadSubscriptionFromStorage: (state) => {
      const stored = sessionStorage.getItem("subscription");
      if (stored) {
        try {
          state.data = JSON.parse(stored);
        } catch {
          state.data = null;
        }
      }
    },

    clearSubscription: (state) => {
      state.data = null;
      sessionStorage.removeItem("subscription");
    },
  },
});

export const {
  setSubscription,
  loadSubscriptionFromStorage,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
