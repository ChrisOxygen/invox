/**
 * Dashboard Stats Card Component
 * Reusable card component for displaying statistics with growth indicators
 */

import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  growthPercentage?: number;
  trend?: "UP" | "DOWN" | "FLAT";
  period?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DashboardStatsCard({
  title,
  value,
  growthPercentage,
  trend = "FLAT",
  period = "/month",
  icon,
  className,
}: DashboardStatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "UP":
        return "bg-green-100 text-green-700";
      case "DOWN":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "UP":
        return <FaArrowTrendUp className="w-3 h-3" />;
      case "DOWN":
        return <FaArrowTrendDown className="w-3 h-3" />;
      default:
        return <FaArrowTrendUp className="w-3 h-3" />;
    }
  };

  const formatGrowthPercentage = (percentage?: number) => {
    if (percentage === undefined) return "+0%";
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage}%`;
  };

  return (
    <div
      className={cn(
        "group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              getTrendColor()
            )}
          >
            {getTrendIcon()}
            <span>{formatGrowthPercentage(growthPercentage)}</span>
          </div>
          <span className="text-gray-500 text-xs">{period}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <span className="font-bold text-2xl lg:text-3xl text-gray-900">
              {value}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
}
