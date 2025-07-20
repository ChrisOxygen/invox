import { IconType } from "react-icons/lib";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavSecondary({
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
                asChild
                size="sm"
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all duration-200"
              >
                <Link
                  href={item.url}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  <item.icon className="group-hover:text-blue-600 transition-colors duration-200" />
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
