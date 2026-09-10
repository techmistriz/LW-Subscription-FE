export const routes = {
  // Main
  home: "/",

  // Auth
  signIn: "/sign-in",
  register: "/register",
  forgotPassword: "/forget-password",
  resetPassword: "/reset-password",

  // User
  dashboard: "/dashboard",
  editProfile: "/edit-profile",
  subscription: "/subscription",

  // Other
  thankYou: "/thankyou",
  invoice: "/invoice",

  // Content
  archive: "/archive",
  magazines: "/magazines",
  authors: "/author",
  categories: "/category",
  tags: "/tag",
  editorial: "/editorial",

  // Static pages
  about: "/about",
  contact: "/contact",
  events: "/events",
  getInvolved: "/get-involved",
  privacy: "/privacy",
  terms: "/terms",
} as const;

// export const routes = {
//   home: "/",
//   signIn: "/sign-in",
//   register: "/register",
//   dashboard: "/dashboard",
//   thankYou: "/thankyou",
//   forgotPassword: "/forget-password",
//   resetPassword: "/reset-password",
//   editProfile: "/edit-profile",
//   subscription: "/subscription",
// } as const;
