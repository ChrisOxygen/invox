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
          "transition-all duration-200 ease-in-out transform",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
          "border-2",
          // Default state
          !active && [
            "text-gray-500 border-transparent",
            "hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50",
            "hover:border-blue-200 hover:shadow-md hover:scale-105",
          ],
          // Active state
          active && [
            "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
            "border-blue-600 shadow-lg",
            "hover:from-blue-700 hover:to-cyan-600 hover:border-blue-700",
            "hover:shadow-xl scale-105",
          ],
          // Disabled state for viewMode buttons without setViewMode
          item.action === "viewMode" &&
            !setViewMode && ["cursor-not-allowed opacity-50 hover:scale-100"]
        )}
        disabled={item.action === "viewMode" && !setViewMode}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{item.tooltip}</span>

        {/* Active indicator dot */}
        {active && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
        )}
      </Button>
    );
  };
  return (
    <TooltipProvider>
      <nav
        className={cn(
          // Base container styles
          "relative border-r border-gray-200 bg-white h-full",
          "flex flex-col items-center py-6",
          "transition-all duration-200 shadow-sm",
          // Responsive width adjustments
          "w-16 sm:w-18 lg:w-20",
          // Gradient accent border
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
          "before:bg-gradient-to-b before:from-blue-600 before:to-cyan-500"
        )}
        role="navigation"
        aria-label="Invoice form navigation"
      >
        {/* Navigation items container */}
        <div className="flex flex-col gap-3 w-full items-center">
          {navigationItems.map((item) => {
            // For navigation items (wrapped with Link)
            if (item.action === "navigate" && item.href) {
              return (
                <Tooltip key={item.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      aria-label={item.ariaLabel || item.tooltip}
                    >
                      {renderButton(item)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={16}
                    className={cn(
                      "bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-medium",
                      "border border-gray-700 shadow-xl",
                      "px-4 py-2 rounded-lg",
                      "backdrop-blur-sm",
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
                  sideOffset={16}
                  className={cn(
                    "bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-medium",
                    "border border-gray-700 shadow-xl",
                    "px-4 py-2 rounded-lg",
                    "backdrop-blur-sm",
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

        {/* Gradient separator line for visual grouping */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-6 mb-2" />

        {/* Optional: Add a small brand accent */}
        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-60" />
      </nav>
    </TooltipProvider>
  );
}

export default InvoiceFormSideBar;
