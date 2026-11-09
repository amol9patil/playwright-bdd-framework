// The only place (besides playwright.config.ts) that reads process.env.
// The defaults are the public SauceDemo logins. For a real app, put the values in a
// git-ignored environments/.env.local or in your CI secrets, never in the code.
export const credentials = {
  username: process.env.APP_USERNAME ?? 'standard_user',
  password: process.env.APP_PASSWORD ?? 'secret_sauce',
} as const;
