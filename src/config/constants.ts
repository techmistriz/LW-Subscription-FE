export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LATEST_MAGAZINES_LIMIT: 5,
  EDITOR_PICKS_LIMIT: 5,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER: "user",
  SUBSCRIPTION: "subscription",
  SCROLL_TO_PRICING: "scrollToPricing",
} as const;

export const OTP = {
  LENGTH: 6,
  RESEND_SECONDS: 60,
};

export const LIMITS = {
  MAX_SEARCH_LENGTH: 100,
};

export const CONTENT = {
  EDITOR_PICKS_CATEGORY_ID: 5,
} as const;
