import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default withAuth(
  async function middleware(req) {
    const locale = req.nextUrl.pathname.split("/")[1];

    // Handle i18n first
    const response = await intlMiddleware(req);
    if (response) return response;

    // Handle auth
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.includes("/auth/signin");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(`/${locale}/Home`, req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(
          `/${locale}/auth/signin?from=${encodeURIComponent(from)}`,
          req.url
        )
      );
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
