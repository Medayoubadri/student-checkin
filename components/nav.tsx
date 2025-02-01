"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="flex justify-between items-center mx-auto container">
        <h1 className="font-bold text-xl">Student Attendance Manager</h1>
        <Button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
