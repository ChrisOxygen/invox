'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'

// ---------------------------------------------------------------------------
// Breadcrumb config — maps route prefixes to page titles
// ---------------------------------------------------------------------------

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/invoices': 'Invoices',
  '/clients': 'Clients',
  '/settings': 'Settings',
  '/onboarding': 'Onboarding',
}

function getPageTitle(pathname: string): string {
  // exact match first
  if (routeLabels[pathname]) return routeLabels[pathname]

  // prefix match for nested routes
  for (const [prefix, label] of Object.entries(routeLabels)) {
    if (pathname.startsWith(prefix + '/')) return label
  }

  return 'Invox'
}

// ---------------------------------------------------------------------------
// AppHeader
// ---------------------------------------------------------------------------

export function AppHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header
      className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Sidebar toggle + separator */}
      <SidebarTrigger
        className="-ml-1 size-8 rounded-md text-[var(--ink-400)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--ink-700)]"
      />
      <Separator orientation="vertical" className="h-4 opacity-60" />

      {/* Page title */}
      <h1
        className="text-[15px] font-semibold leading-none tracking-[-0.01em]"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--ink-900)',
        }}
      >
        {pageTitle}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right-side actions */}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md text-[var(--ink-400)] hover:bg-[var(--surface-overlay)] hover:text-[var(--ink-700)]"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
      </Button>
    </header>
  )
}
