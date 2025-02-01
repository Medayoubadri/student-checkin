import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

export default function Header() {
  return (
    <header className="flex justify-end items-center px-4 h-16">
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
