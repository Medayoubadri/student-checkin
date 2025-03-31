"use client";

import * as React from "react";
import { LogOut, LayoutDashboard, Users } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

// Sidebar component for the dashboard layout
// This component is responsible for rendering the sidebar navigation menu
// It includes links to different sections of the application and a sign-out button
// It also handles the sign-out functionality
export function AppSidebar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("MainNav");

  const handleSignOut = async () => {
    await signOut();
    redirect(`/${locale}/auth/signin`);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t("Home"), href: `/${locale}/Home` },
    { icon: Users, label: t("Students List"), href: `/${locale}/students` },
  ];
  return (
    <>
      {/* Sidebar for larger screens */}
      {!isMobile && (
        <Sidebar className="flex border-none w-64">
          <SidebarHeader>
            <Link
              href={`/${locale}/Home`}
              className="flex flex-col items-center gap-2"
            >
              <Image src="/chess-logo.svg" alt="Logo" width={60} height={60} />
              <h2 className="font-semibold text-2xl whitespace-nowrap">
                {t("title")}
              </h2>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={
                      pathname === item.href
                        ? "!bg-slate-100 md:!bg-background shadow-md dark:!bg-emerald-950 !text-primary !font-extrabold "
                        : ""
                    }
                  >
                    <Link
                      href={item.href}
                      className="flex items-center hover:bg-white hover:dark:bg-emerald-900/30 active:!bg-white active:dark:!bg-emerald-900 mb-2 px-4 py-6 rounded-md"
                    >
                      <item.icon className="mr-2 !w-6 !h-6" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="justify-start hover:bg-destructive p-6 hover:border-destructive w-full hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 w-4 h-4" />
              {t("signOut")}
            </Button>
          </SidebarFooter>
        </Sidebar>
      )}
      {/* The sidebar is hidden on mobile devices and replaced with a bottom navigation bar */}
      {isMobile && (
        <nav className="right-0 bottom-0 left-0 z-50 fixed flex justify-around items-center bg-background shadow-[0px_-3px_15px_rgba(0,0,0,0.10)] p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.href}
              className={cn(
                "list-none rounded-md",
                pathname === item.href
                  ? "bg-slate-200 dark:bg-zinc-900 text-primary font-extrabold"
                  : ""
              )}
            >
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center p-2 text-sm"
              >
                <item.icon className="mb-1 size-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuItem>
          ))}
          <Button
            variant="ghost"
            className="flex flex-col items-center p-0"
            onClick={handleSignOut}
          >
            <LogOut className="size-8" />
            {t("signOut")}
          </Button>
        </nav>
      )}
    </>
  );
}
