"use client";

import { LogOut, LayoutDashboard, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

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
        <h2 className="font-semibold text-2xl">{t("title")}</h2>
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
                    ? "!bg-slate-200 dark:!bg-emerald-950 !text-primary !font-extrabold"
                    : ""
                }
              >
                <Link
                  href={item.href}
                  className="flex items-center hover:dark:bg-emerald-900/15 hover:bg-slate-200/35 mb-2 px-4 py-6 rounded-md"
                >
                  <item.icon className="mr-2 w-8 h-8" />
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
          className="justify-start hover:border-destructive hover:bg-destructive p-6 w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 w-4 h-4" />
          {t("signOut")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
