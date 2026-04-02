"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
] as const;

const generalNav = [
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

// ---------------------------------------------------------------------------
// Logo variants
// ---------------------------------------------------------------------------

function InvoxLogoFull() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-0.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-(--blue-600)">
        <Image
          src="/assets/logo-white-icon.webp"
          alt="Invox"
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
      </div>
      <span className="text-[17px] font-bold tracking-snug font-display text-(--ink-900)">
        Inv
        <span className="text-(--blue-600)">ox</span>
      </span>
    </div>
  );
}

function InvoxLogoIcon() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-(--blue-600)">
      <Image
        src="/assets/logo-white-icon.webp"
        alt="Invox"
        width={20}
        height={20}
        className="w-5 h-5 object-contain"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ---------------------------------------------------------------------------
// Desktop nav link — icon-only on md, full on lg, tooltip visible on md only
// ---------------------------------------------------------------------------

function DesktopNavLink({ href, label, icon: Icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const linkClass = cn(
    "flex h-9 items-center rounded transition-colors duration-100 font-display text-[13.5px] font-semibold",
    "justify-center px-0 gap-0",
    "lg:justify-start lg:px-3 lg:gap-3",
    isActive
      ? "bg-(--blue-50) text-(--blue-600)"
      : "text-(--ink-400) hover:text-(--blue-600)",
  );

  return (
    <Tooltip>
      <TooltipTrigger render={<Link href={href} className={linkClass} />}>
        <Icon className="size-4 shrink-0" />
        <span className="hidden lg:block truncate">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function DesktopNavButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const btnClass = cn(
    "flex h-9 w-full items-center rounded transition-colors duration-100 font-display text-[13.5px] font-semibold",
    "justify-center px-0 gap-0",
    "lg:justify-start lg:px-3 lg:gap-3",
    "text-(--ink-400) hover:text-(--blue-600)",
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" onClick={onClick} className={btnClass} />}
      >
        <Icon className="size-4 shrink-0" />
        <span className="hidden lg:block truncate">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Mobile nav link — always full labels, closes drawer on click
// ---------------------------------------------------------------------------

function MobileNavLink({
  href,
  label,
  icon: Icon,
  onClose,
}: NavLinkProps & { onClose: () => void }) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex h-10 items-center gap-3 rounded px-3 text-[13.5px] font-semibold transition-colors duration-100 font-display",
        isActive
          ? "bg-(--blue-50) text-(--blue-600)"
          : "text-(--ink-400) hover:text-(--blue-600)",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center gap-3 rounded px-3 text-[13.5px] font-semibold transition-colors duration-100 font-display text-(--ink-400) hover:text-(--blue-600)"
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Group label
// ---------------------------------------------------------------------------

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-mono text-(--ink-300) font-display">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// AppSidebar
// ---------------------------------------------------------------------------

type AppSidebarProps = {
  user?: {
    name: string;
    email: string;
    initials: string;
  };
};

export function AppSidebar({ user }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const displayInitials =
    user?.initials ?? displayName.slice(0, 2).toUpperCase();

  // Listen for mobile menu toggle dispatched by AppHeader
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("invox:toggle-mobile-menu", handleToggle);
    return () =>
      window.removeEventListener("invox:toggle-mobile-menu", handleToggle);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop + Tablet sidebar — hidden on mobile (<md)                   */}
      {/* md: 52px icon-only | lg: 220px full labels                          */}
      {/* ------------------------------------------------------------------ */}
      <TooltipProvider delay={400}>
        <aside
          className={cn(
            "hidden md:flex flex-col overflow-hidden rounded border shrink-0",
            "bg-(--surface-base) border-(--border-default)",
            // md = icon-only width, lg = full width
            "w-13 lg:w-55",
            "transition-[width] duration-200 ease-in-out",
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start px-0 lg:px-4 py-5">
            <span className="block lg:hidden">
              <InvoxLogoIcon />
            </span>
            <span className="hidden lg:block">
              <InvoxLogoFull />
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-1.5 lg:px-3 pb-4">
            {/* Menu group */}
            <div className="mb-6">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-mono text-(--ink-300) font-display hidden lg:block">
                Menu
              </p>
              <div className="flex flex-col gap-0.5">
                {mainNav.map((item) => (
                  <DesktopNavLink key={item.href} {...item} />
                ))}
              </div>
            </div>

            {/* General group — pushed to bottom */}
            <div className="mt-auto">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-mono text-(--ink-300) font-display hidden lg:block">
                General
              </p>
              <div className="flex flex-col gap-0.5">
                {generalNav.map((item) => (
                  <DesktopNavLink key={item.href} {...item} />
                ))}
                <DesktopNavButton label="Help" icon={HelpCircle} />
                <DesktopNavButton
                  label="Log out"
                  icon={LogOut}
                  onClick={handleSignOut}
                />
              </div>
            </div>
          </nav>

          {/* Divider */}
          <div className="mx-1.5 lg:mx-3 shrink-0 h-px bg-(--border-default)" />

          {/* User footer */}
          <div className="flex shrink-0 items-center justify-center lg:justify-start gap-3 px-0 lg:px-4 py-4">
            <Tooltip>
              <TooltipTrigger render={<span className="shrink-0" />}>
                <Avatar className="size-8 rounded">
                  <AvatarFallback className="rounded text-[11px] font-semibold bg-(--blue-50) text-(--blue-700) font-display">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="lg:hidden">
                {displayName}
              </TooltipContent>
            </Tooltip>
            <div className="hidden lg:flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13px] font-semibold leading-tight font-display text-(--ink-900)">
                {displayName}
              </span>
              <span className="truncate text-[11px] leading-tight text-(--ink-400)">
                {displayEmail}
              </span>
            </div>
          </div>
        </aside>
      </TooltipProvider>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Sheet drawer — slides in from left on small screens          */}
      {/* ------------------------------------------------------------------ */}
      <Sheet open={mobileOpen} onOpenChange={(open: boolean) => setMobileOpen(open)}>
        <SheetContent
          side="left"
          className="w-65 p-0 bg-(--surface-base) border-(--border-default) flex flex-col"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo */}
          <div className="flex items-center px-4 py-5">
            <InvoxLogoFull />
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-3 pb-4">
            <div className="mb-6">
              <NavGroupLabel>Menu</NavGroupLabel>
              <div className="flex flex-col gap-0.5">
                {mainNav.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    {...item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <NavGroupLabel>General</NavGroupLabel>
              <div className="flex flex-col gap-0.5">
                {generalNav.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    {...item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
                <MobileNavButton label="Help" icon={HelpCircle} />
                <MobileNavButton
                  label="Log out"
                  icon={LogOut}
                  onClick={handleSignOut}
                />
              </div>
            </div>
          </nav>

          {/* Divider */}
          <div className="mx-3 shrink-0 h-px bg-(--border-default)" />

          {/* User footer */}
          <div className="flex shrink-0 items-center gap-3 px-4 py-4">
            <Avatar className="size-8 shrink-0 rounded">
              <AvatarFallback className="rounded text-[11px] font-semibold bg-(--blue-50) text-(--blue-700) font-display">
                {displayInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13px] font-semibold leading-tight font-display text-(--ink-900)">
                {displayName}
              </span>
              <span className="truncate text-[11px] leading-tight text-(--ink-400)">
                {displayEmail}
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
