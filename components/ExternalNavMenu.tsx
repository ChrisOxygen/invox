"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { NAVIGATION_LINKS } from "@/constants";
import { ExternalNavMenuMobile } from "./ExternalNavMenuMobile";

function ExternalNavMenu() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1250px] px-5 lg:px-0 items-center mx-auto w-full sm:grid flex justify-between grid-cols-[300px_1fr_300px] h-20">
        <Link href="/" className="flex items-center justify-start">
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
        </Link>
        <nav className="justify-center hidden lg:flex">
          <menu className="flex gap-8 items-center list-none">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </menu>
        </nav>
        <div className="hidden lg:flex gap-3 items-center justify-end">
          <Button className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-700 font-medium py-3 px-7 rounded-lg border border-blue-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
            <Link href="/login" className="flex items-center gap-2">
              <FiLogIn className="w-5 h-5 mr-1" />
              Login
            </Link>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-9 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
            <Link href="/signup" className="flex items-center gap-2 text-white">
              Get Started
              <FiUserPlus className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="lg:hidden  col-start-3 flex gap-3 items-center justify-end">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-9 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
            <Link href="/signup" className="flex items-center gap-2 text-white">
              Get Started
              <FiUserPlus className="w-5 h-5 ml-1" />
            </Link>
          </Button>
          <ExternalNavMenuMobile />
        </div>
      </div>
    </div>
  );
}

export default ExternalNavMenu;
