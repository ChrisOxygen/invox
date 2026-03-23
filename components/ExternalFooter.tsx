import { LEGAL_LINKS, NAVIGATION_LINKS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Twitter, Github } from 'lucide-react'

function ExternalFooter() {
  return (
    <footer className="bg-(--ink-950) border-t border-(--ink-700)">
      <div className="max-w-312.5 mx-auto px-5 lg:px-0 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-14">
          {/* Brand column */}
          <div className="flex flex-col gap-5 max-w-85">
            <Link href="/">
              <Image
                src="/assets/invox-main-logo.webp"
                alt="Invox"
                width={120}
                height={50}
                className="object-contain w-24 h-auto brightness-0 invert opacity-85"
              />
            </Link>
            <p className="text-sm text-(--ink-400) leading-relaxed font-body">
              Invoice management built for Nigerian freelancers and small businesses.
              Get paid faster, stay organized.
            </p>
            <div className="flex gap-2">
              {[
                {
                  href: 'https://www.linkedin.com/in/christopher-okafor-17084416b/',
                  icon: Linkedin,
                  label: 'LinkedIn',
                },
                {
                  href: 'https://x.com/chris_okafor_x',
                  icon: Twitter,
                  label: 'Twitter',
                },
                {
                  href: 'https://github.com/ChrisOxygen',
                  icon: Github,
                  label: 'GitHub',
                },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-(--r-md) border border-(--ink-700) flex items-center justify-center text-(--ink-400) hover:text-white hover:border-(--ink-500) transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-16 sm:gap-24">
            {/* Navigate column */}
            <div className="flex flex-col gap-5">
              <span className="text-xs font-semibold text-(--ink-400) uppercase tracking-widest font-display">
                Navigate
              </span>
              <nav>
                <menu className="flex flex-col gap-3 list-none">
                  {NAVIGATION_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-(--ink-400) hover:text-white transition-colors duration-200 font-body"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </menu>
              </nav>
            </div>

            {/* Legal column */}
            <div className="flex flex-col gap-5">
              <span className="text-xs font-semibold text-(--ink-400) uppercase tracking-widest font-display">
                Legal
              </span>
              <menu className="flex flex-col gap-3 list-none">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-(--ink-400) hover:text-white transition-colors duration-200 font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </menu>
            </div>
          </div>
        </div>

        <div className="border-t border-(--ink-700) pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-(--ink-500) font-body">
            &copy; {new Date().getFullYear()} Invox. All rights reserved.
          </p>
          <p className="text-xs text-(--ink-500) font-body">
            Built with <span className="text-(--error)">♥</span> by{' '}
            <Link
              href="https://github.com/ChrisOxygen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--blue-400) hover:text-(--blue-200) transition-colors duration-200"
            >
              Chris Okafor
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default ExternalFooter
