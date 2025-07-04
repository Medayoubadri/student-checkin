"use client";

import { LogOut, LayoutDashboard, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export function MainNav() {
  const pathname = usePathname();
  const t = useTranslations("MainNav");
  const router = useRouter();
  const locale = useLocale();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t("Home"), href: `/${locale}/Home` },
    { icon: Users, label: t("Students List"), href: `/${locale}/students` },
  ];
  return (
    <Sidebar
      className="z-50 md:flex hidden border-none w-64"
      collapsible="offcanvas"
    >
      <SidebarHeader className="items-center px-4 py-4">
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
                    ? "!bg-background shadow-md dark:!bg-emerald-950 !text-primary !font-extrabold "
                    : ""
                }
              >
                <Link
                  href={item.href}
                  className="flex items-center hover:dark:bg-emerald-900/15 hover:bg-white active:!bg-white mb-2 px-4 py-6 rounded-md"
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
          className="justify-start hover:border-destructive hover:bg-destructive p-6 w-full hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 w-4 h-4" />
          {t("signOut")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
