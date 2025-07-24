"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Edit, LayoutGrid, Palette, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceForm, ViewMode } from "../index";

/**
 * Navigation item configuration
 */
interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Icon component to display */
  icon: LucideIcon;
  /** Tooltip text to show on hover */
  tooltip: string;
  /** Type of action when clicked */
  action: "navigate" | "viewMode";
  /** Navigation href for "navigate" action */
  href?: string;
  /** View mode to set for "viewMode" action */
  viewMode?: ViewMode;
  /** Accessibility label */
  ariaLabel?: string;
}

function InvoiceFormSideBar() {
  const pathname = usePathname();

  const { state, setViewMode } = useInvoiceForm();

  const { viewMode } = state;

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      icon: Home,
      tooltip: "Go to Dashboard",
      action: "navigate",
      href: "/app",
      ariaLabel: "Navigate to dashboard",
    },
    {
      id: "invoice-details",
      icon: Edit,
      tooltip: "Invoice Details",
      action: "viewMode",
      viewMode: "invoice-details",
      ariaLabel: "Switch to invoice details view",
    },
    {
      id: "layout",
      icon: LayoutGrid,
      tooltip: "Layout Settings",
      action: "viewMode",
      viewMode: "layout",
      ariaLabel: "Switch to layout settings view",
    },
    {
      id: "theme",
      icon: Palette,
      tooltip: "Theme Settings",
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
   * Render a navigation button
   */
  const renderButton = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isActive(item);

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleItemClick(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        aria-label={item.ariaLabel || item.tooltip}
        aria-pressed={active}
        className={cn(
          // Base styles
          "h-12 w-12 p-0 rounded-lg relative cursor-pointer",
          "transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          // Default state
          "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
          // Active state
          active && ["text-black"],
          // Disabled state for viewMode buttons without setViewMode
          item.action === "viewMode" && !setViewMode && " cursor-not-allowed"
        )}
        disabled={item.action === "viewMode" && !setViewMode}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{item.tooltip}</span>

        {/* Active indicator */}
      </Button>
    );
  };
  return (
    <TooltipProvider>
      <nav
        className={cn(
          // Base container styles
          "border-r border-gray-200 bg-white h-full w-16",
          "flex flex-col items-center py-4",
          "transition-all duration-200",
          // Responsive adjustments
          "sm:w-20 lg:w-16"
        )}
        role="navigation"
        aria-label="Invoice form navigation"
      >
        {" "}
        {/* Navigation items container */}
        <div className="flex flex-col gap-2 w-full items-center">
          {navigationItems.map((item) => {
            // For navigation items (wrapped with Link)
            if (item.action === "navigate" && item.href) {
              return (
                <Tooltip key={item.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded-lg"
                      aria-label={item.ariaLabel || item.tooltip}
                    >
                      {renderButton(item)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className={cn(
                      "bg-black text-white text-sm font-medium",
                      "border border-gray-800 shadow-lg",
                      "px-3 py-2 rounded-md",
                      "z-50"
                    )}
                    role="tooltip"
                  >
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              );
            }

            // For viewMode items (direct buttons)
            return (
              <Tooltip key={item.id} delayDuration={300}>
                <TooltipTrigger asChild>{renderButton(item)}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className={cn(
                    "bg-black text-white text-sm font-medium",
                    "border border-gray-800 shadow-lg",
                    "px-3 py-2 rounded-md",
                    "z-50"
                  )}
                  role="tooltip"
                >
                  {item.tooltip}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        {/* Separator line for visual grouping */}
        <div className="w-8 h-px bg-gray-200 mt-4" />
      </nav>
    </TooltipProvider>
  );
}

export default InvoiceFormSideBar;
