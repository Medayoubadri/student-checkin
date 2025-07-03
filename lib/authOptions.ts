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
      // Check if the URL is relative (starts with a slash)
      if (url.startsWith("/")) {
        // Extract locale from the URL or default to 'en'
        const locale = url.split("/")[1] || "fr";
        // Ensure the URL starts with the locale and redirects to the Home page
        return `${baseUrl}/${locale}/Home`;
      }
      // If it's an absolute URL, return it as is
      return url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
