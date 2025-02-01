// app/[locale]/(dashboard)/layout.tsx
"use client";

import type React from "react"; // Added import for React
import Header from "@/components/header";
import { MainNav } from "@/components/main-nav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex w-full h-screen">
        <MainNav />
        <header className="top-0 right-0 left-0 z-10 fixed">
          <Header />
        </header>
        <div className="flex-1 justify-center items-center md:shadow-md md:mx-6 md:my-4 mt-14 md:mt-16 md:border md:rounded-xl w-full overflow-hidden">
          <main className="flex bg-slate-50 dark:bg-background w-full h-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
