import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Attendance Manager",
  description: "Efficiently manage student attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessProvider>{children}</SessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
