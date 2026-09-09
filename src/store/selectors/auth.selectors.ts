import type { RootState } from "../store";

export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthenticated = (s: RootState) => s.auth.isAuthenticated;
export const selectAuthInitialized = (s: RootState) => s.auth.isInitialized;
export const selectPasswordReset = (s: RootState) => s.auth.passwordReset;
