// This file is a client component that wraps the NextAuth session provider around its children.
// It allows the use of session data in the client-side components of the application.
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type React from "react";
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
