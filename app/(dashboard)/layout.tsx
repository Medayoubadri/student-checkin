"use client";

import Header from "@/components/header";
import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-screen h-screen">
      <header className="top-0 left-0 z-10 absolute w-full">
        <Header />
      </header>
      <main className="flex w-full h-full">
        <MainNav />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
