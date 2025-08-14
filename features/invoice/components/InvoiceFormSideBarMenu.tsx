"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Edit,
  LayoutGrid,
  Palette,
  Menu,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceForm, ViewMode } from "../index";

/**
 * Navigation item configuration for mobile menu
 */
interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Icon component to display */
  icon: LucideIcon;
  /** Display text for the navigation item */
  label: string;
  /** Type of action when clicked */
  action: "navigate" | "viewMode";
  /** Navigation href for "navigate" action */
  href?: string;
  /** View mode to set for "viewMode" action */
  viewMode?: ViewMode;
  /** Accessibility label */
  ariaLabel?: string;
}

interface InvoiceFormSideBarMenuProps {
  /** Optional custom trigger button */
  trigger?: React.ReactNode;
}

function InvoiceFormSideBarMenu({ trigger }: InvoiceFormSideBarMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const { state, setViewMode } = useInvoiceForm();
  const { viewMode } = state;

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      action: "navigate",
      href: "/app",
      ariaLabel: "Navigate to dashboard",
    },
    {
      id: "invoice-details",
      icon: Edit,
      label: "Invoice Details",
      action: "viewMode",
      viewMode: "invoice-details",
      ariaLabel: "Switch to invoice details view",
    },
    {
      id: "layout",
      icon: LayoutGrid,
      label: "Layout Settings",
      action: "viewMode",
      viewMode: "layout",
      ariaLabel: "Switch to layout settings view",
    },
    {
      id: "theme",
      icon: Palette,
      label: "Theme Settings",
      action: "viewMode",
      viewMode: "theme",
      ariaLabel: "Switch to theme settings view",
    },
  ];

  /**
   * Check if a navigation item is currently active
   */
  const isActive = (item: NavigationItem): boolean => {
    if (item.action === "navigate" && item.href) {
      return pathname === item.href;
    }
    if (item.action === "viewMode" && item.viewMode) {
      return viewMode === item.viewMode;
    }
    return false;
  };

  /**
   * Handle navigation item click
   */
  const handleItemClick = (item: NavigationItem) => {
    if (item.action === "viewMode" && item.viewMode && setViewMode) {
      setViewMode(item.viewMode);
      setIsOpen(false); // Close the sheet after selection
    } else if (item.action === "navigate") {
      setIsOpen(false); // Close the sheet before navigation
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, item: NavigationItem) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  /**
   * Default trigger button if none provided
   */
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 sm:h-9 sm:w-9 p-0 text-2xl rounded-lg",
        "lg:hidden", // Only show on mobile/tablet
        "text-gray-600 hover:text-blue-600",
        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50",
        "transition-all duration-200"
      )}
      aria-label="Open navigation menu"
    >
      <Menu className="size-6" />
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader className="border-b border-gray-100 pb-4 mb-6">
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Invoice Navigation
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 p-5">
          <menu className="flex flex-col gap-2 list-none">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              // For navigation items (wrapped with Link)
              if (item.action === "navigate" && item.href) {
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 w-full text-left px-4 py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] cursor-pointer rounded-lg
                        ${
                          active
                            ? "bg-gradient-to-r from-transparent to-blue-600 border-r-2 border-blue-600 via-cyan-500 text-gray-700"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        }
                      `}
                      aria-label={item.ariaLabel || item.label}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              }

              // For viewMode items (direct buttons)
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    disabled={item.action === "viewMode" && !setViewMode}
                    className={`
                      flex items-center gap-3 w-full text-left px-4 py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] cursor-pointer rounded-lg
                      ${
                        active
                          ? "bg-gradient-to-r from-transparent to-blue-600 border-r-2 border-blue-600 via-cyan-500 text-gray-700"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }
                      ${
                        item.action === "viewMode" &&
                        !setViewMode &&
                        "cursor-not-allowed opacity-50"
                      }
                    `}
                    aria-label={item.ariaLabel || item.label}
                    aria-pressed={active}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </menu>
        </nav>

        <SheetFooter className="border-t border-gray-100 pt-6 mt-auto">
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">
              Invox Invoice Builder
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default InvoiceFormSideBarMenu;
