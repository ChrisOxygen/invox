"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS } from "@/constants";
import { FiMenu } from "react-icons/fi";

export function ExternalNavMenuMobile() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className=" cursor-pointer text-gray-700 hover:text-blue-600 transition-all duration-200">
          <FiMenu className="text-4xl" />
        </span>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader className="border-b border-gray-100 pb-4 mb-6">
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Navigation
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 p-5">
          <menu className="flex flex-col gap-2 list-none">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <SheetTrigger asChild>
                  <Link
                    href={link.href}
                    className={`
                      block w-full text-left px-4 py-3 font-medium transition-all duration-200 transform hover:scale-[1.02]
                      ${
                        isActiveLink(link.href)
                          ? "bg-gradient-to-r from-transparent to-blue-600 border-r-2 border-blue-600 via-cyan-500 text-gray-700"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </SheetTrigger>
              </li>
            ))}
          </menu>
        </nav>

        <SheetFooter className="border-t border-gray-100 pt-6 mt-auto">
          <div className="flex flex-col gap-3 w-full">
            <SheetTrigger asChild>
              <Button
                asChild
                className="w-full bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium py-3 px-6 rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2"
                >
                  Login
                </Link>
              </Button>
            </SheetTrigger>

            <SheetTrigger asChild>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 text-white"
                >
                  Get Started
                </Link>
              </Button>
            </SheetTrigger>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
