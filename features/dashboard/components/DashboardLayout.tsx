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
import OnBoarding from "@/features/business/components/onBoarding/OnBoarding";
import { useBusiness } from "@/features/business/hooks/useBusiness";
import { useUser } from "@/hooks/useUser";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isPending: gettingUser } = useUser();

  const { hasBusiness, isPending: gettingBusiness, isError } = useBusiness();

  if (gettingUser || gettingBusiness) {
    return (
      <div className="w-full h-full grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error loading business data</p>
      </div>
    );
  }

  return (
    <>
      {hasBusiness ? (
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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <OnBoarding />
      )}
    </>
  );
}

export default DashboardLayout;
