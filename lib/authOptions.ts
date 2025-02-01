import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { locales } from "@/config";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Ensure baseUrl doesn't have a trailing slash
      baseUrl = baseUrl.replace(/\/$/, "");

      // If the URL is relative (starts with a slash)
      if (url.startsWith("/")) {
        // Extract locale from the URL or default to 'fr'
        const urlParts = url.split("/").filter(Boolean);
        const locale = urlParts[0] in locales ? urlParts[0] : "fr";

        // Construct the redirect URL
        return `${baseUrl}/${locale}/Home`;
      }

      // If it's an absolute URL within the same site, add locale
      if (url.startsWith(baseUrl)) {
        const locale = url.split("/")[3] in locales ? url.split("/")[3] : "fr";
        return `${baseUrl}/${locale}/Home`;
      }

      // For external URLs, return as is
      return url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
