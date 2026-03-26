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
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAVIGATION_LINKS } from '@/constants'
import { Menu, UserPlus, LogIn } from 'lucide-react'

interface ExternalNavMenuMobileProps {
  isScrolled?: boolean
}

export function ExternalNavMenuMobile({ isScrolled }: ExternalNavMenuMobileProps) {
  const pathname = usePathname()

  const isActiveLink = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Sheet>
      {/* 44×44px tap target (Apple HIG / Material minimum) */}
      <SheetTrigger
        aria-label="Open navigation menu"
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-100 cursor-pointer ${
          isScrolled
            ? 'text-(--ink-700) hover:text-(--ink-900) hover:bg-(--surface-overlay)'
            : 'text-(--ink-100) hover:text-white'
        }`}
      >
        <Menu className="w-5 h-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[82vw] max-w-75 bg-(--surface-base) flex flex-col p-0 gap-0 border-l border-(--border-default)"
      >
        {/* Header — logo instead of generic "Menu" title */}
        <SheetHeader className="px-5 py-4 border-b border-(--border-default) shrink-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Invox"
            width={100}
            height={36}
            className="object-contain h-7 w-auto"
          />
        </SheetHeader>

        {/* Nav links — 48px rows for comfortable touch targets */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <SheetClose
                  render={<Link href={link.href} />}
                  nativeButton={false}
                  className={`flex w-full items-center px-4 py-3 rounded-lg text-sm font-semibold font-display tracking-[-0.01em] transition-colors duration-100 ${
                    isActiveLink(link.href)
                      ? 'bg-(--blue-50) text-(--blue-600)'
                      : 'text-(--ink-500) hover:text-(--ink-900) hover:bg-(--surface-overlay)'
                  }`}
                >
                  {link.label}
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA buttons — pinned to bottom */}
        <SheetFooter className="px-4 py-5 border-t border-(--border-default) shrink-0 flex-col gap-2">
          <SheetClose
            render={<Link href="/login" />}
            nativeButton={false}
            className="w-full inline-flex items-center justify-center gap-2 border border-(--border-strong) text-(--ink-700) hover:bg-(--surface-overlay) rounded-lg py-2.5 px-4 text-sm font-semibold font-display transition-colors duration-100"
          >
            <LogIn className="w-4 h-4" />
            Log in
          </SheetClose>
          <SheetClose
            render={<Link href="/register" />}
            nativeButton={false}
            className="w-full inline-flex items-center justify-center gap-2 bg-(--blue-600) hover:bg-(--blue-700) text-white rounded-lg py-2.5 px-4 text-sm font-semibold font-display transition-colors duration-100"
          >
            Get started free
            <UserPlus className="w-4 h-4" />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
