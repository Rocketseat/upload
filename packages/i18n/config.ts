export const config = {
  defaultLocale: "en",
  locales: ["en", "pt"],
} as const;

export type Locale = (typeof config)["locales"][number];
