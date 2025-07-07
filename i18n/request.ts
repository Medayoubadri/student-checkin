import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// This function is called on every request to determine the locale and load the appropriate messages
// based on the locale. It uses the `getRequestConfig` function from `next-intl/server`
// to handle the request and response configuration for internationalization.
export default getRequestConfig(async ({ requestLocale }) => {
  // The `requestLocale` is awaited to ensure that the locale is determined before proceeding.
  let locale = await requestLocale;

  // The `routing` object is imported from a separate module to manage the available locales and the default locale.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
