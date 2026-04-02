"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus, Bell, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// ---------------------------------------------------------------------------
// Route metadata — title + description
// ---------------------------------------------------------------------------

const routeMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your invoices and revenue",
  },
  "/invoices": {
    title: "Invoices",
    description: "Manage and track all your invoices",
  },
  "/clients": {
    title: "Clients",
    description: "Manage your client relationships",
  },
  "/settings": {
    title: "Settings",
    description: "Manage your account and preferences",
  },
};

function getPageMeta(pathname: string) {
  if (routeMeta[pathname]) return routeMeta[pathname];
  for (const [prefix, meta] of Object.entries(routeMeta)) {
    if (pathname.startsWith(prefix + "/")) return meta;
  }
  return { title: "Invox", description: "" };
}

// ---------------------------------------------------------------------------
// AppHeader
// ---------------------------------------------------------------------------

export function AppHeader() {
  const pathname = usePathname();
  const { title, description } = getPageMeta(pathname);

  const isClientsPage = pathname === "/clients";

  return (
    <header className="flex shrink-0 items-center gap-3 py-4 px-4 md:pl-0 md:pr-4">
      {/* Mobile menu toggle — hidden on md+ (sidebar is visible) */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() =>
          window.dispatchEvent(new CustomEvent("invox:toggle-mobile-menu"))
        }
        className="md:hidden flex items-center justify-center size-9 rounded text-(--ink-400) hover:text-(--blue-600) transition-colors duration-100"
      >
        <Menu className="size-5" />
      </button>

      {/* Page title + description */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <h1 className="text-[20px] font-bold leading-tight tracking-h2 font-display text-(--ink-900) truncate">
          {title}
        </h1>
        {description && (
          <p className="hidden sm:block text-[12px] font-body text-(--ink-400) truncate">
            {description}
          </p>
        )}
      </div>

      <div className="flex-1" />

      {/* Search — hidden on mobile, visible md+ */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-(--ink-300)" />
        <input
          type="text"
          placeholder="Search by client or invoice..."
          readOnly
          className="h-9 w-52 lg:w-64 rounded border border-(--border-default) bg-(--surface-raised) pl-9 pr-4 text-[13px] placeholder:text-(--ink-300) outline-none cursor-default"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isClientsPage ? (
          <Button
            size="sm"
            className="h-9 rounded px-3 sm:px-4 gap-1.5"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("invox:add-client"))
            }
          >
            <Plus className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Add Client</span>
          </Button>
        ) : (
          <Link href="/invoices/new">
            <Button size="sm" className="h-9 rounded px-3 sm:px-4 gap-1.5">
              <Plus className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">Create Invoice</span>
            </Button>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded text-(--ink-400)"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-(--error)" />
        </Button>
      </div>
    </header>
  );
}
