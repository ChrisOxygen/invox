"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useState, useEffect } from "react";

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
      <div className="max-w-[1250px] items-center mx-auto w-full grid grid-cols-[300px_1fr_300px] h-20">
        <Image
          src="/assets/invox-main-logo.webp"
          alt="Logo"
          width={120}
          height={50}
          className="object-contain"
        />
        <nav className="flex justify-center">
          <menu className="flex gap-8 items-center list-none">
            <li>
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 hover:underline"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#testimonials"
                className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 hover:underline"
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 hover:underline"
              >
                Contact
              </Link>
            </li>
          </menu>
        </nav>
        <div className="flex gap-3 items-center justify-end">
          <Button className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-700 font-medium py-3 px-7 rounded-lg border border-blue-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
            <Link href="/login" className="flex items-center gap-2">
              <FiLogIn className="w-5 h-5 mr-1" />
              Login
            </Link>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-9 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
            <Link href="/signup" className="flex items-center gap-2 text-white">
              Sign Up
              <FiUserPlus className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExternalNavMenu;
