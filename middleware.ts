import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/", // The index route
    "/auth/:path*",
    "/api/:path*",
    "/Home/:path*",
    "/students/:path*",
    "/(fr|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
