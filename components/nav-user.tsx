"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "./ui/skeleton";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { user, isPending: gettingUser } = useUser();
  if (gettingUser || !user) return <Skeleton className="h-10 w-full" />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-50 data-[state=open]:to-cyan-50 data-[state=open]:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all duration-200 group"
            >
              <Avatar className="h-8 w-8 rounded-lg border-2 border-blue-200 shadow-sm">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-semibold">
                  {user
                    ?.name!.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900 group-hover:text-blue-800 transition-colors duration-200">
                  {user.name}
                </span>
                <span className="truncate text-xs text-blue-600 font-medium">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-blue-500 group-hover:text-blue-700 transition-colors duration-200" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-blue-200 shadow-xl shadow-blue-100/50"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm bg-gradient-to-r from-blue-50/30 to-cyan-50/30 rounded-t-lg">
                <Avatar className="h-8 w-8 rounded-lg border-2 border-blue-200">
                  <AvatarImage src={user.image || ""} alt={user.name!} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-semibold">
                    {user
                      .name!.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-blue-600 font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-blue-100" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-200">
                <Sparkles className="text-blue-500" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="border-blue-100" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-200">
                <Link href="/app/account" className=" flex gap-2">
                  <BadgeCheck className="text-blue-500" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-200">
                <CreditCard className="text-blue-500" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-200">
                <Bell className="text-blue-500" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="border-blue-100" />
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
              className="hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
