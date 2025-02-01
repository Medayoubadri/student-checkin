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
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function SignIn() {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = params.locale as string;

  const handleSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: `${window.location.origin}/${locale}/Home`,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center md:bg-slate-100 dark:bg-zinc-950 p-4 min-h-screen gray-100">
      <div className="top-4 right-4 fixed">
        <ThemeToggle />
      </div>
      <Card className="dark:bg-zinc-900 shadow-none md:shadow-2xl py-5 border-none w-full md:max-w-2xl">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-center mb-4">
              <Image
                src="/chess-logo.svg"
                alt={t("logoAlt")}
                width={80}
                height={80}
              />
            </div>
            <h1 className="font-bold text-4xl text-center text-primary md:text-5xl">
              {t("title")}
            </h1>
          </CardTitle>
          <CardDescription className="text-center text-lg">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button
            variant="outline"
            className="py-6 w-full md:max-w-md text-lg transition-all hover:scale-105"
            onClick={() => handleSignIn("google")}
          >
            <Mail className="mr-2 w-5 h-5" />
            {t("continueWithGoogle")}
          </Button>
          <Button
            variant="outline"
            className="py-6 w-full md:max-w-md text-lg transition-all hover:scale-105"
            onClick={() => handleSignIn("github")}
          >
            <Github className="mr-2 w-5 h-5" />
            {t("continueWithGithub")}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">{t("footerText")}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
