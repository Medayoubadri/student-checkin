"use client";

// import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { UserNav } from "@/app/[locale]/(dashboard)/_components/user-nav";
import { LanguageSelector } from "@/components/LanguageSelector";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

// Header component for the dashboard layout
export default function Header() {
  const t = useTranslations("MainNav");
  const locale = useLocale();
  return (
    <header className="flex justify-between items-center bg-transparent px-3 md:px-6 w-full h-14">
      <Link
        href={`/${locale}/Home`}
        className="md:hidden flex items-center gap-2"
      >
        <Image src="/chess-logo.svg" alt="Logo" width={30} height={30} />
        <h2 className="font-semibold text-xl whitespace-nowrap">
          {t("title")}
        </h2>
      </Link>
      {/* <SidebarTrigger className="md:hidden" /> */}
      <div className="flex-1 md:flex-none" />{" "}
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
