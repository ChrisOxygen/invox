"use client";

import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS } from "@/constants";
import { ExternalNavMenuMobile } from "./ExternalNavMenuMobile";

function ExternalNavMenu() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="w-full fixed top-4 left-0 z-50 px-4">
      <div
        className={` mx-auto w-full flex items-center justify-between h-14 px-4 rounded transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.10)] "
            : "bg-white/80 backdrop-blur-sm "
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Invox"
            width={120}
            height={50}
            className="object-contain w-22 h-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <menu className="flex gap-7 items-center list-none">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium font-display tracking-[-0.01em] transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-(--blue-600)"
                      : "text-(--ink-500) hover:text-(--ink-900)"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </menu>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex gap-2 items-center shrink-0">
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            variant="ghost"
            className="font-medium px-4 h-8 rounded-lg text-sm text-(--ink-500) hover:text-(--ink-900) hover:bg-(--surface-overlay) transition-all duration-200 shadow-none"
          >
            Log in
          </Button>
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white  px-4 h-8 rounded-lg text-sm shadow-none transition-colors duration-200 flex items-center gap-1.5"
          >
            Try it for free
            <UserPlus className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex gap-2 items-center">
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold py-1.5 px-3.5 rounded-lg text-sm shadow-none flex items-center gap-1"
          >
            Try free
            <UserPlus className="w-3.5 h-3.5" />
          </Button>
          <ExternalNavMenuMobile isScrolled={true} />
        </div>
      </div>
    </div>
  );
}

export default ExternalNavMenu;
