import { LEGAL_LINKS, NAVIGATION_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn, FaXTwitter, FaGithub } from "react-icons/fa6";

function ExternalFooter() {
  return (
    <footer className="relative bg-(--surface-base) border-t border-(--border-default) overflow-hidden">
      <div className="relative max-w-312.5 mx-auto px-5 lg:px-0 py-14">
        {/* Main row */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/">
              <Image
                src="/assets/invox-main-logo.webp"
                alt="Invox"
                width={120}
                height={50}
                className="object-contain w-24 h-auto"
              />
            </Link>
            <p className="text-sm text-(--ink-400) leading-relaxed font-body">
              Invox is a powerful invoicing platform designed to simplify your
              billing process. Create, send, and manage invoices with ease,
              ensuring you get paid faster and more efficiently.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5 lg:items-end">
            {/* Nav links — horizontal */}
            <nav>
              <ul className="flex flex-wrap gap-x-8 gap-y-2 list-none">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-(--ink-700) hover:text-(--blue-600) transition-colors duration-150 font-display"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal links — horizontal with pipe separators */}
            <nav>
              <ul className="flex flex-wrap items-center gap-y-1 list-none">
                {LEGAL_LINKS.map((link, i) => (
                  <li key={link.href} className="flex items-center">
                    {i > 0 && (
                      <span className="mx-3 text-(--border-strong) text-xs select-none">
                        |
                      </span>
                    )}
                    <Link
                      href={link.href}
                      className="text-xs text-(--ink-400) hover:text-(--ink-700) transition-colors duration-150 font-body italic"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social icons */}
            <div className="flex gap-2">
              {[
                {
                  href: "https://www.linkedin.com/in/christopher-okafor-17084416b/",
                  icon: FaLinkedinIn,
                  label: "LinkedIn",
                },
                {
                  href: "https://x.com/chris_okafor_x",
                  icon: FaXTwitter,
                  label: "X (Twitter)",
                },
                {
                  href: "https://github.com/ChrisOxygen",
                  icon: FaGithub,
                  label: "GitHub",
                },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-(--r-md) border border-(--border-default) flex items-center justify-center text-(--ink-400) hover:text-(--ink-700) hover:border-(--border-strong) transition-colors duration-150"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-(--border-default) pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-(--ink-400) font-body">
            &copy; {new Date().getFullYear()} Invox. All rights reserved.
          </p>
          <p className="text-xs text-(--ink-400) font-body">
            Built with <span className="text-(--error)">♥</span> by{" "}
            <Link
              href="https://github.com/ChrisOxygen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--blue-600) hover:text-(--blue-700) transition-colors duration-150"
            >
              Chris Okafor
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ExternalFooter;
