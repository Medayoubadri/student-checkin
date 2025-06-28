"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-center p-24 min-h-screen">
      <h1 className="mb-8 font-bold text-4xl">Sign In</h1>
      <div className="space-y-4">
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Sign in with Google
        </Button>
        <Button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
