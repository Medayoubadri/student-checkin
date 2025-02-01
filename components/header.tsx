"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 w-full h-16">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 md:flex-none" />{" "}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
