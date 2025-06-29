// app/(dashboard)/layout.tsx
"use client";

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
        <div className="flex flex-col flex-1">
          <header className="top-0 right-0 left-0 z-10 fixed bg-background">
            <Header />
          </header>
          <main className="flex-1 mt-16 px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
