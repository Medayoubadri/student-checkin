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

export function MainNav() {
  const pathname = usePathname();

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Home", href: "/Home" },
    { icon: Users, label: "Students List", href: "/students" },
  ];
  return (
    <Sidebar className="z-50 md:flex hidden w-64" collapsible="offcanvas">
      <SidebarHeader className="items-center px-4 py-4">
        <h2 className="font-semibold text-2xl">Check-In Mate</h2>
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
                    ? "!bg-slate-200 dark:!bg-slate-900 !text-primary !font-extrabold"
                    : ""
                }
              >
                <Link
                  href={item.href}
                  className="flex items-center hover:dark:bg-slate-900/35 hover:bg-slate-200/35 mb-2 px-4 py-6 rounded-md"
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
          variant="destructive"
          className="justify-start w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 w-4 h-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
