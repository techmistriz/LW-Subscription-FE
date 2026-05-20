import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./authSlice";

export interface Subscription {
  id?: number;
  plan_id?: number;
  name?: string;
  amount?: number;
  total_amount?: number;
  subtotal_amount?: number;
  tax_amount?: number;
  tax_percent?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration_value?: number;
  duration_unit?: string;
  purchase_type?: string;
  features?: string;
  is_trial?: string;
  tag?: string;
  next_subscription_id?: number | null;
  previous_subscription_id?: number | null;
}

interface SubscriptionState {
  active: Subscription | null;   // Current active subscription
  pending: Subscription | null;  // Pending upgrade subscription (next_subscription)
  isLoaded: boolean;
}

const initialState: SubscriptionState = {
  active: null,
  pending: null,
  isLoaded: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    // Main setter that handles both active and pending subscriptions from API response
    setSubscription: (state, action: PayloadAction<{
      subscription?: Subscription;
      next_subscription?: Subscription | null;
    } | Subscription>) => {
      // Handle the case where the payload is the subscription object directly (backward compatibility)
      if (!action.payload || ('id' in action.payload && !('subscription' in action.payload))) {
        const subscription = action.payload as Subscription;
        const status = subscription.status?.toUpperCase();
        
        if (status === "PENDING") {
          state.pending = subscription;
        } else if (status === "ACTIVE") {
          state.active = subscription;
          // Clear pending if it's the same plan (activation completed)
          if (state.pending?.plan_id === subscription.plan_id) {
            state.pending = null;
          }
        }
      } 
      // Handle the case where payload has both subscription and next_subscription
      else {
        const { subscription, next_subscription } = action.payload as {
          subscription?: Subscription;
          next_subscription?: Subscription | null;
        };
        
        // Set active subscription
        if (subscription) {
          const status = subscription.status?.toUpperCase();
          if (status === "ACTIVE") {
            state.active = subscription;
          } else if (status === "PENDING") {
            state.pending = subscription;
          }
        }
        
        // Set pending subscription (next_subscription)
        if (next_subscription) {
          state.pending = {
            ...next_subscription,
            status: next_subscription.status || "PENDING"
          };
        } else if (next_subscription === null) {
          state.pending = null;
        }
      }
      
      state.isLoaded = true;
      
      // Store in sessionStorage
      sessionStorage.setItem(
        "subscription",
        JSON.stringify({
          active: state.active,
          pending: state.pending,
        })
      );
    },

    // Set only active subscription
    setActiveSubscription: (state, action: PayloadAction<Subscription>) => {
      state.active = action.payload;
      state.isLoaded = true;
      
      sessionStorage.setItem(
        "subscription",
        JSON.stringify({
          active: state.active,
          pending: state.pending,
        })
      );
    },

    // Set only pending subscription
    setPendingSubscription: (state, action: PayloadAction<Subscription>) => {
      state.pending = action.payload;
      state.isLoaded = true;
      
      sessionStorage.setItem(
        "subscription",
        JSON.stringify({
          active: state.active,
          pending: state.pending,
        })
      );
    },

    // Clear pending subscription
    clearPendingSubscription: (state) => {
      state.pending = null;
      
      sessionStorage.setItem(
        "subscription",
        JSON.stringify({
          active: state.active,
          pending: state.pending,
        })
      );
    },

    // Load from storage
    loadSubscriptionFromStorage: (state) => {
      const stored = sessionStorage.getItem("subscription");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          state.active = parsed.active || null;
          state.pending = parsed.pending || null;
        } catch (e) {
          console.error("Failed to parse subscription", e);
        }
      }

      state.isLoaded = true;
    },

    // Clear all subscription data
    clearSubscription: (state) => {
      state.active = null;
      state.pending = null;
      state.isLoaded = false;
      sessionStorage.removeItem("subscription");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.active = null;
      state.pending = null;
      state.isLoaded = false;
      sessionStorage.removeItem("subscription");
    });
  },
});

export const {
  setSubscription,
  setActiveSubscription,
  setPendingSubscription,
  clearPendingSubscription,
  loadSubscriptionFromStorage,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;