"use client";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_MAIN_NAV, DASHBOARD_SECONDARY_NAV } from "@/constants";
import Image from "next/image";

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/default.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="bg-blue-50"
      collapsible="icon"
      variant="inset"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/app"
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex aspect-square size-8 items-center justify-center rounded-lg shadow-lg shadow-blue-200/50 group-hover:shadow-xl group-hover:shadow-blue-300/50 transition-all duration-300">
                  <Image
                    src="/assets/logo-white-icon.webp"
                    alt="Invoice Icon"
                    width={16}
                    height={16}
                    className="size-4"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">
                    Invox
                  </span>
                  <span className="truncate text-xs text-blue-600 font-medium">
                    Invoice Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-blue-50">
        <NavMain items={DASHBOARD_MAIN_NAV} />
        <NavSecondary items={DASHBOARD_SECONDARY_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
