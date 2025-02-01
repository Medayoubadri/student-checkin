"use client";

import { LogOut, LayoutDashboard, Users, FileInput } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Home", href: "/Home" },
    { icon: Users, label: "Students List", href: "/students" },
    { icon: FileInput, label: "Import/Export", href: "/import-export" },
  ];
  return (
    <SidebarProvider className="w-fit">
      <Sidebar className="w-64">
        <SidebarHeader className="items-center px-4 py-4">
          <h2 className="font-semibold text-3xl">CheckInMate</h2>
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
                      ? "!bg-slate-200 dark:!bg-slate-900 !text-primary"
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
            variant="outline"
            className="justify-start w-full"
            onClick={() => console.log("Logout clicked")}
          >
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
