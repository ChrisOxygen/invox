"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function DashboardLayoutWI({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border-b border-blue-100">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-blue-200"
            />
            <DashboardBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayoutWI;
