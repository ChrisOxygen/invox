import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlinePencil } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";

interface User {
  name?: string | null;
  email: string;
  currency?: string | null;
  onboardingCompleted: boolean;
  signature?: string | null;
}

interface ProfileSectionProps {
  user: User;
  onEditSignature: () => void;
  onDeleteAccount: () => void;
}

export function ProfileSection({
  user,
  onEditSignature,
  onDeleteAccount,
}: ProfileSectionProps) {
  return (
    <Card className="border border-blue-100/60 bg-gradient-to-br from-white/95 to-blue-50/20 backdrop-blur-sm shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center gap-6 lg:gap-8">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center flex-1">
            <Avatar className="size-16 lg:size-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 text-lg font-semibold">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                {user.name}
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">{user.email}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex gap-6 justify-center sm:justify-start lg:gap-8 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <Separator
                orientation="vertical"
                className="h-12 hidden lg:block"
              />
              <div className="text-center">
                <span className="text-xs lg:text-sm uppercase font-semibold text-gray-500 tracking-wide">
                  Currency
                </span>
                <div className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                  {user.currency?.toUpperCase()} ($)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Separator
                orientation="vertical"
                className="h-12 hidden lg:block"
              />
              <div className="text-center">
                <span className="text-xs lg:text-sm uppercase font-semibold text-gray-500 tracking-wide">
                  Status
                </span>
                <div className="mt-1">
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm lg:text-base font-semibold">
                    {user.onboardingCompleted ? "Active" : "Setup Required"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="relative sm:ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onEditSignature}
                  size="sm"
                  variant="outline"
                  className="absolute -top-3 -right-3 size-8 rounded-full p-0 bg-white hover:bg-gray-50 shadow-sm z-10"
                >
                  <HiOutlinePencil className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add or change signature</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-48 lg:w-56 h-20 lg:h-24 bg-gradient-to-br from-gray-50 to-blue-50/40 border-2 border-dashed border-blue-200/60 rounded-lg flex flex-col items-center justify-center hover:from-blue-50/30 hover:to-cyan-50/30 transition-all duration-200">
              {user.signature ? (
                <Image
                  src={user.signature}
                  alt="User signature"
                  width={300}
                  height={100}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <>
                  <span className="font-great-vibes text-2xl lg:text-3xl text-blue-400">
                    Your Signature
                  </span>
                  <span className="text-xs text-blue-400 mt-1">
                    No signature uploaded
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-3">
            <Link href="/app/invoices">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                View Invoices
              </Button>
            </Link>
            <Link href="/app/clients">
              <Button variant="outline">View Clients</Button>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 hover:bg-gray-100"
              >
                <BsThreeDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onDeleteAccount}
                className="text-red-600 focus:text-red-600"
              >
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
