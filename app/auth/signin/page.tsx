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
import Image from "next/image";

export default function LoginCard() {
  return (
    <div className="flex flex-col justify-center items-center bg-slate-100 dark:bg-zinc-950 p-4 min-h-screen gray-100">
      <div className="top-4 right-4 fixed">
        <ThemeToggle />
      </div>
      <Card className="dark:bg-zinc-900 shadow-2xl border-none w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-center mb-4">
              <Image
                src="/chess-logo.svg"
                alt="Check-in Mate Logo"
                width={80}
                height={80}
              />
            </div>
            <h1 className="font-bold text-4xl text-center text-primary md:text-5xl">
              Check-in Mate
            </h1>
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Sign in to manage attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4 grid">
          <Button
            variant="outline"
            className="py-6 w-full text-lg transition-all hover:scale-105"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Mail className="mr-2 w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="py-6 w-full text-lg transition-all hover:scale-105"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="mr-2 w-5 h-5" />
            Continue with GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Checkmate your attendance game!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
