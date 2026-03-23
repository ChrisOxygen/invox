'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAVIGATION_LINKS } from '@/constants'
import { Menu } from 'lucide-react'

interface ExternalNavMenuMobileProps {
  isScrolled?: boolean
}

export function ExternalNavMenuMobile({ isScrolled }: ExternalNavMenuMobileProps) {
  const pathname = usePathname()

  const isActiveLink = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className={`cursor-pointer transition-colors duration-200 ${
          isScrolled
            ? 'text-(--ink-700) hover:text-(--ink-900)'
            : 'text-(--ink-100) hover:text-white'
        }`}
      >
        <Menu className="w-6 h-6" />
      </SheetTrigger>

      <SheetContent className="w-80 sm:w-96 bg-(--surface-base)">
        <SheetHeader className="border-b border-(--border-default) pb-4 mb-4">
          <SheetTitle className="font-display font-bold text-(--ink-900) text-lg tracking-[-0.02em]">
            Menu
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-1">
          <menu className="flex flex-col gap-1 list-none">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <SheetClose
                  render={<Link href={link.href} />}
                  className={`block w-full text-left px-4 py-3 rounded-(--r-lg) text-sm font-medium font-display transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? 'bg-(--blue-50) text-(--blue-600)'
                      : 'text-(--ink-700) hover:text-(--ink-900) hover:bg-(--surface-overlay)'
                  }`}
                >
                  {link.label}
                </SheetClose>
              </li>
            ))}
          </menu>
        </nav>

        <SheetFooter className="border-t border-(--border-default) pt-5 mt-auto">
          <div className="flex flex-col gap-2.5 w-full">
            <SheetClose
              render={<Link href="/login" />}
              className="w-full inline-flex items-center justify-center border border-(--border-strong) text-(--ink-700) hover:bg-(--surface-overlay) rounded-(--r-md) py-2 px-4 text-sm font-semibold font-display transition-colors duration-200"
            >
              Login
            </SheetClose>
            <SheetClose
              render={<Link href="/signup" />}
              className="w-full inline-flex items-center justify-center bg-(--blue-600) hover:bg-(--blue-700) text-white rounded-(--r-md) py-2 px-4 text-sm font-semibold font-display transition-colors duration-200"
            >
              Get Started
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
