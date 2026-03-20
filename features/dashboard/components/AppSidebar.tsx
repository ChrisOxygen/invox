'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronUp,
  LogOut,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/clients', label: 'Clients', icon: Users },
] as const

const accountNav = [
  { href: '/settings', label: 'Settings', icon: Settings },
] as const

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------

function InvoxLogo() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex items-center gap-2.5 px-1 py-0.5">
      {/* Icon mark — always visible */}
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'var(--blue-600)' }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="14" height="3" rx="1.5" fill="white" />
          <rect
            x="2"
            y="7.5"
            width="9"
            height="2.5"
            rx="1.25"
            fill="white"
            fillOpacity="0.6"
          />
          <rect
            x="2"
            y="12"
            width="11"
            height="2.5"
            rx="1.25"
            fill="white"
            fillOpacity="0.6"
          />
          <circle cx="14" cy="13.25" r="2.5" fill="var(--cyan-400)" />
        </svg>
      </div>

      {/* Wordmark — hidden when collapsed */}
      {!isCollapsed && (
        <span
          className="text-[17px] font-bold tracking-[-0.03em] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Inv
          <span style={{ color: 'var(--cyan-400)' }}>ox</span>
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Nav item
// ---------------------------------------------------------------------------

type NavItemProps = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive =
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <SidebarMenuItem>
      {/* Use render prop (base-ui pattern) to render as <a> via Next Link */}
      <SidebarMenuButton
        render={<Link href={href} />}
        isActive={isActive}
        tooltip={label}
        className="h-9 gap-3 rounded-lg px-3 text-[13.5px] font-medium"
      >
        <Icon className="size-4 shrink-0" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// ---------------------------------------------------------------------------
// User footer
// ---------------------------------------------------------------------------

type UserFooterProps = {
  name: string
  email: string
  initials: string
}

function UserFooter({ name, email, initials }: UserFooterProps) {
  const router = useRouter()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* render DropdownMenuTrigger as SidebarMenuButton via render prop */}
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={name}
                className="h-11 gap-3 rounded-lg px-3"
              />
            }
          >
            <Avatar className="size-7 shrink-0 rounded-md">
              <AvatarFallback
                className="rounded-md text-[11px] font-semibold"
                style={{
                  backgroundColor: 'var(--blue-800)',
                  color: 'var(--blue-100)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span
                  className="truncate text-[13px] font-semibold leading-tight text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name}
                </span>
                <span
                  className="truncate text-[11px] leading-tight"
                  style={{ color: 'var(--ink-400)' }}
                >
                  {email}
                </span>
              </div>
            )}

            {!isCollapsed && (
              <ChevronUp
                className="ml-auto size-3.5 shrink-0"
                style={{ color: 'var(--ink-500)' }}
              />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={6}
            className="w-56"
          >
            <div className="px-2 py-1.5">
              <p
                className="text-[13px] font-semibold leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--ink-900)',
                }}
              >
                {name}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--ink-400)' }}>
                {email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <User className="size-3.5" />
              Account settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                // sign-out handled in Phase 3 auth integration
              }}
            >
              <LogOut className="size-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ---------------------------------------------------------------------------
// AppSidebar
// ---------------------------------------------------------------------------

type AppSidebarProps = {
  user?: {
    name: string
    email: string
    initials: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const displayName = user?.name ?? 'User'
  const displayEmail = user?.email ?? ''
  const displayInitials =
    user?.initials ?? displayName.slice(0, 2).toUpperCase()

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ── Header ── */}
      <SidebarHeader className="px-3 pb-2 pt-4">
        <InvoxLogo />
      </SidebarHeader>

      <SidebarSeparator className="opacity-20" />

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-2">
        {/* Main nav */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel
            className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{
              color: 'var(--ink-500)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account nav — pushed to bottom */}
        <SidebarGroup className="mt-auto p-0">
          <SidebarGroupLabel
            className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{
              color: 'var(--ink-500)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="opacity-20" />

      {/* ── User footer ── */}
      <SidebarRail />
      <SidebarFooter className="px-2 py-3">
        <UserFooter
          name={displayName}
          email={displayEmail}
          initials={displayInitials}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
