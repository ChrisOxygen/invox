"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
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
// Logo
// ---------------------------------------------------------------------------

function InvoxLogo() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-0.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-(--blue-600)">
        <Image
          src="/assets/logo-white-icon.webp"
          alt="Invox"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <span className="text-[17px] font-bold tracking-[-0.03em] [font-family:var(--font-display)] text-(--ink-900)">
        Inv
        <span className="text-(--blue-600)">ox</span>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nav item types
// ---------------------------------------------------------------------------

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ---------------------------------------------------------------------------
// Nav item — button (for sign-out, help)
// ---------------------------------------------------------------------------

type NavButtonProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

function NavButton({ label, icon: Icon, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center gap-3 rounded px-3 text-[13.5px] font-semibold transition-colors duration-100 [font-family:var(--font-display)] text-(--ink-400)"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--blue-600)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-400)";
      }}
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
    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-(--ink-300) [font-family:var(--font-display)]">
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
  const router = useRouter();
  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const displayInitials =
    user?.initials ?? displayName.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-55 shrink-0 flex-col overflow-hidden rounded border bg-(--surface-base) border-(--border-default)">
      {/* Logo */}
      <div className="flex items-center px-4 py-5">
        <InvoxLogo />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 pb-4">
        {/* Menu group */}
        <div className="mb-6">
          <NavGroupLabel>Menu</NavGroupLabel>
          <div className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <NavLinkWithHover key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* General group — pushed to bottom */}
        <div className="mt-auto">
          <NavGroupLabel>General</NavGroupLabel>
          <div className="flex flex-col gap-0.5">
            {generalNav.map((item) => (
              <NavLinkWithHover key={item.href} {...item} />
            ))}
            <NavButton label="Help" icon={HelpCircle} />
            <NavButton label="Log out" icon={LogOut} onClick={handleSignOut} />
          </div>
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-3 shrink-0 h-px bg-(--border-default)" />

      {/* User footer */}
      <div className="flex shrink-0 items-center gap-3 px-4 py-4">
        <Avatar className="size-8 shrink-0 rounded">
          <AvatarFallback className="rounded text-[11px] font-semibold bg-(--blue-50) text-(--blue-700) [font-family:var(--font-display)]">
            {displayInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-semibold leading-tight [font-family:var(--font-display)] text-(--ink-900)">
            {displayName}
          </span>
          <span className="truncate text-[11px] leading-tight text-(--ink-400)">
            {displayEmail}
          </span>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// NavLink with hover via CSS — avoids inline style/class collision
// Using a wrapper that applies hover via onMouseEnter/Leave for full token support
// ---------------------------------------------------------------------------

function NavLinkWithHover({ href, label, icon: Icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center gap-3 rounded px-3 text-[13.5px] font-semibold transition-colors duration-100 [font-family:var(--font-display)]",
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
