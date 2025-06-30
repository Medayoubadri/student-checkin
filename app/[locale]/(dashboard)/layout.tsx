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
        <header className="top-0 right-0 left-0 z-10 fixed bg-background">
          <Header />
        </header>
        <div className="flex justify-center mt-16 w-full overflow-y-auto">
          <main className="flex-1 bg-slate-100 dark:bg-background p-4 w-full lg:max-w-7xl">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
