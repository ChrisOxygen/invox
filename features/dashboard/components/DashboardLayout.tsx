"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import InBoxLoader from "@/components/InBoxLoader";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending: gettingUser, isError } = useUser();
  const router = useRouter();

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!user?.onboardingCompleted && !gettingUser) {
      router.push("/app/welcome");
    }
  }, [user?.onboardingCompleted, gettingUser, router]);

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error loading user data</p>
      </div>
    );
  }

  // Return null while redirecting to prevent flash of content
  if (!user?.onboardingCompleted) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
