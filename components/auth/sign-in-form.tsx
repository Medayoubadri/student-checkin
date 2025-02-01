"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignInForm({ providers }: { providers: any }) {
  return (
    <div className="mt-4">
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name} className="mb-3">
          <Button
            className="w-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
