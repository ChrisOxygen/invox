'use client'

import { Button } from '@/shared/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NAVIGATION_LINKS } from '@/constants'
import { ExternalNavMenuMobile } from './ExternalNavMenuMobile'

function ExternalNavMenu() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-(--surface-base)/90 backdrop-blur-md border-b border-(--border-default)'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1250px] px-5 lg:px-0 items-center mx-auto w-full flex justify-between h-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Invox"
            width={120}
            height={50}
            className={`object-contain w-[100px] h-auto transition-all duration-300 ${
              isScrolled ? '' : 'brightness-0 invert'
            }`}
          />
        </Link>

        <nav className="hidden lg:flex">
          <menu className="flex gap-8 items-center list-none">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium font-display tracking-[-0.01em] transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-(--blue-600)'
                      : isScrolled
                        ? 'text-(--ink-500) hover:text-(--ink-900)'
                        : 'text-(--ink-200) hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </menu>
        </nav>

        <div className="hidden lg:flex gap-2.5 items-center">
          <Button
            render={<Link href="/login" />}
            variant="ghost"
            className={`font-medium px-5 h-9 rounded-(--r-md) text-sm transition-all duration-200 shadow-none flex items-center gap-2 ${
              isScrolled
                ? 'text-(--ink-700) hover:text-(--ink-900) hover:bg-(--surface-overlay)'
                : 'text-(--ink-200) hover:text-white hover:bg-white/10'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button
            render={<Link href="/signup" />}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold px-5 h-9 rounded-(--r-md) text-sm shadow-none transition-colors duration-200 flex items-center gap-2"
          >
            Get Started
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>

        <div className="lg:hidden flex gap-3 items-center">
          <Button
            render={<Link href="/signup" />}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold py-2 px-4 rounded-(--r-md) text-sm shadow-none flex items-center gap-1"
          >
            Get Started
            <UserPlus className="w-4 h-4 ml-0.5" />
          </Button>
          <ExternalNavMenuMobile isScrolled={isScrolled} />
        </div>
      </div>
    </div>
  )
}

export default ExternalNavMenu
