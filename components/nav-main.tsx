import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { IconType } from "react-icons/lib";

export function NavMain({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: IconType;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                size="sm"
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-100 data-[active=true]:to-cyan-100 data-[active=true]:border-blue-300"
              >
                <Link
                  href={item.url}
                  className="text-gray-700 hover:text-blue-700 group-data-[active=true]:text-blue-800 font-medium transition-colors duration-200"
                >
                  <item.icon className="group-hover:text-blue-600 group-data-[active=true]:text-blue-700 transition-colors duration-200" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
