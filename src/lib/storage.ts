import { STORAGE_KEYS } from "@/config/constants";

const isBrowser = () => typeof window !== "undefined";

export const storage = {
  get<T = string>(key: string, parse = false): T | null {
    if (!isBrowser()) return null;

    const raw = sessionStorage.getItem(key);

    if (raw === null) return null;

    if (!parse) {
      return raw as T;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      console.error(`storage: failed to parse "${key}"`);
      return null;
    }
  },

  set(key: string, value: unknown): void {
    if (!isBrowser()) return;

    const raw = typeof value === "string" ? value : JSON.stringify(value);

    sessionStorage.setItem(key, raw);
  },

  remove(key: string): void {
    if (!isBrowser()) return;

    sessionStorage.removeItem(key);
  },

  clearAuthData(): void {
    [STORAGE_KEYS.USER, STORAGE_KEYS.AUTH_TOKEN, "subscription"].forEach(
      (key) => this.remove(key),
    );
  },
};
