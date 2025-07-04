// app/[locale]/(dashboard)/layout.tsx
import type React from "react";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/SideBar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const locale = params.locale;

  if (!session) {
    redirect(`/${locale}/auth/signin`);
  }

  return (
    <SidebarProvider>
      <div className="relative flex bg-gradient-to-tr from-slate-100 dark:from-zinc-900 to-indigo-100 dark:to-gray-950 w-full h-screen overflow-y-hidden">
        {/* <MainNav /> */}
        <AppSidebar />
        <header className="top-0 right-0 left-0 z-10 fixed">
          <Header />
        </header>
        <div className="flex-1 justify-center items-center md:shadow-md md:mx-6 md:my-4 mt-14 md:mt-16 md:border md:rounded-xl w-full overflow-hidden">
          <main className="flex bg-transparent md:bg-gray-50 md:dark:bg-black/40 w-full h-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
