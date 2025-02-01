import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

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
      // Preserve the locale in redirects
      if (url.startsWith(baseUrl)) return url;

      // Handle relative URLs
      if (url.startsWith("/")) {
        // Extract locale from the URL if present
        const urlParts = url.split("/");
        const locale = urlParts[1];
        const isLocale = ["fr", "en"].includes(locale);

        // If URL already has locale, use it as is
        if (isLocale) {
          return `${baseUrl}${url}`;
        }

        // Default to 'fr' locale if none present
        return `${baseUrl}/fr${url}`;
      }

      // Default redirect
      return `${baseUrl}/fr/Home`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
