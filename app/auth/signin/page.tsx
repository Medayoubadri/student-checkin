"use client";

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginCard() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="top-4 right-4 absolute">
        <ThemeToggle />
      </div>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-2xl text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4 grid">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Mail className="mr-2 w-4 h-4" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="mr-2 w-4 h-4" />
            Continue with GitHub
          </Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
