import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./authSlice";

export interface Subscription {
  created_at: string | number | Date;
  id?: number;
  plan_id?: number;
  membership_plan_id?: number;

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

  plan?: any;
}

interface SubscriptionState {
  active: Subscription | null;
  pending: Subscription[];
  isLoaded: boolean;
}

const initialState: SubscriptionState = {
  active: null,
  pending: [],
  isLoaded: false,
};

const saveToStorage = (
  active: Subscription | null,
  pending: Subscription[],
) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "subscription",
      JSON.stringify({
        active,
        pending,
      }),
    );
  }
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,

  reducers: {
    setSubscription: (
      state,
      action: PayloadAction<
        | Subscription
        | {
            subscription?: Subscription;
            next_subscriptions?: Subscription[];
          }
      >,
    ) => {
      const payload = action.payload;

      // Backward compatibility
      if ("id" in payload && !("subscription" in payload)) {
        const subscription = payload as Subscription;

        if (subscription.status?.toUpperCase() === "ACTIVE") {
          state.active = subscription;
        }

        if (subscription.status?.toUpperCase() === "PENDING") {
          state.pending = [subscription];
        }
      } else {
        const { subscription, next_subscriptions } = payload as {
          subscription?: Subscription;
          next_subscriptions?: Subscription[];
        };

        state.active = subscription ?? null;
        state.pending = next_subscriptions ?? [];
      }

      state.isLoaded = true;

      saveToStorage(state.active, state.pending);
    },

    setActiveSubscription: (
      state,
      action: PayloadAction<Subscription | null>,
    ) => {
      state.active = action.payload;
      state.isLoaded = true;

      saveToStorage(state.active, state.pending);
    },

    setPendingSubscription: (state, action: PayloadAction<Subscription[]>) => {
      state.pending = action.payload;
      state.isLoaded = true;

      saveToStorage(state.active, state.pending);
    },

    addPendingSubscription: (state, action: PayloadAction<Subscription>) => {
      state.pending.push(action.payload);

      saveToStorage(state.active, state.pending);
    },

    clearPendingSubscription: (state) => {
      state.pending = [];

      saveToStorage(state.active, state.pending);
    },

    loadSubscriptionFromStorage: (state) => {
      if (typeof window === "undefined") {
        state.isLoaded = true;
        return;
      }

      const stored = sessionStorage.getItem("subscription");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);

          state.active = parsed.active ?? null;
          state.pending = parsed.pending ?? [];
        } catch (error) {
          console.error(
            "Failed to parse subscription from sessionStorage",
            error,
          );

          state.active = null;
          state.pending = [];
        }
      }

      state.isLoaded = true;
    },

    clearSubscription: (state) => {
      state.active = null;
      state.pending = [];
      state.isLoaded = false;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("subscription");
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.active = null;
      state.pending = [];
      state.isLoaded = false;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("subscription");
      }
    });
  },
});

export const {
  setSubscription,
  setActiveSubscription,
  setPendingSubscription,
  addPendingSubscription,
  clearPendingSubscription,
  loadSubscriptionFromStorage,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
