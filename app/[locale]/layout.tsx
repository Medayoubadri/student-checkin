// app/[locale]/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/SessionProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Attendance Manager",
  description: "Efficiently manage student attendance",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <SessionProvider>
      <html lang={locale}>
        <body className={inter.className}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
