import { LEGAL_LINKS, NAVIGATION_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

function ExternalFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="content-wrapper flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col items-center lg:flex-row justify-between gap-8 lg:gap-12 w-full">
          <div className="flex flex-col items-center lg:items-start gap-6 w-full max-w-[600px]">
            <Link href="/" className="flex items-center justify-start">
              <Image
                src="/assets/invox-main-logo.webp"
                alt="Logo"
                width={120}
                height={50}
                className="object-contain w-20 sm:w-24 md:w-[120px] h-auto"
              />
            </Link>
            <p className="text-gray-600 text-center lg:text-left text-base sm:text-lg leading-relaxed">
              Invox is a powerful invoicing platform designed to simplify your
              billing process. Create, send, and manage invoices with ease,
              ensuring you get paid faster and more efficiently.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-center lg:items-end">
            <nav className="w-full lg:w-auto">
              <menu className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 items-center list-none justify-center lg:justify-end">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-800 hover:text-blue-600 text-lg sm:text-xl lg:text-2xl font-medium transition-all duration-200 hover:underline hover:scale-105 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </menu>
            </nav>

            <menu className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 items-center list-none">
              {LEGAL_LINKS.map((link, index) => (
                <li
                  key={link.href}
                  className={`${
                    index < LEGAL_LINKS.length - 1
                      ? "border-r border-gray-300 pr-3 sm:pr-4"
                      : ""
                  }`}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 italic font-medium text-sm sm:text-base transition-all duration-200 hover:underline cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </menu>

            <div className="flex gap-4 sm:gap-5">
              <Link
                href=""
                className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg p-2 rounded-lg hover:bg-white/50 cursor-pointer"
              >
                <FaLinkedin className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
              <Link
                href=""
                className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg p-2 rounded-lg hover:bg-white/50 cursor-pointer"
              >
                <FaTwitter className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
              <Link
                href=""
                className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg p-2 rounded-lg hover:bg-white/50 cursor-pointer"
              >
                <FaInstagram className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
              <Link
                href=""
                className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg p-2 rounded-lg hover:bg-white/50 cursor-pointer"
              >
                <FaGithub className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-10">
          <div className="text-gray-600 text-sm sm:text-base order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Invox. All rights reserved.
          </div>
          <div className="text-gray-600 text-sm sm:text-base order-1 sm:order-2">
            Built with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
            <Link
              href=""
              className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline cursor-pointer"
            >
              Your Company Name
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-50/50"></div>
        <Image
          src="/assets/invox-main-logo.webp"
          alt="Invox Logo"
          width={3000}
          height={3000}
          className="object-contain brightness-0 -mb-[20px] sm:-mb-[80px] opacity-3 grayscale"
        />
      </div>
    </footer>
  );
}

export default ExternalFooter;
