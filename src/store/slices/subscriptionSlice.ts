import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Subscription } from "@/types/models";
import { logoutUser } from "./authSlice";
import { storage } from "@/lib/storage";

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
  storage.set("subscription", { active, pending });
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

      if ("id" in payload) {
        if (payload.status?.toUpperCase() === "ACTIVE") {
          state.active = payload;
        }

        if (payload.status?.toUpperCase() === "PENDING") {
          state.pending = [payload];
        }
      } else {
        state.active = payload.subscription ?? null;
        state.pending = payload.next_subscriptions ?? [];
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
      const parsed = storage.get<{
        active: Subscription | null;
        pending: Subscription[];
      }>("subscription", true);

      state.active = parsed?.active ?? null;
      state.pending = parsed?.pending ?? [];
      state.isLoaded = true;
    },

    clearSubscription: (state) => {
      state.active = null;
      state.pending = [];
      state.isLoaded = false;

      storage.remove("subscription");
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
