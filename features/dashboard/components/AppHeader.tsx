'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

// ---------------------------------------------------------------------------
// Route → page title map
// ---------------------------------------------------------------------------

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/invoices': 'Invoices',
  '/clients': 'Clients',
  '/settings': 'Settings',
  '/onboarding': 'Onboarding',
}

function getPageTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname]
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
      className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-5"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-default)',
      }}
    >
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

      <div className="flex-1" />

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md"
        style={{ color: 'var(--ink-400)' }}
        aria-label="Notifications"
      >
        <Bell className="size-4" />
      </Button>
    </header>
  )
}
