import React from "react";
import { AlertTriangle } from "lucide-react";

interface WarningToastProps {
  title?: string;
  description?: string;
}

export function WarningToast({
  title = "Warning",
  description,
}: WarningToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border-2 border-amber-200 rounded-xl shadow-lg shadow-amber-100/50 min-w-[320px] max-w-[400px]">
      {/* Warning Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-full flex items-center justify-center mt-0.5">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Brand Accent */}
      <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full"></div>
    </div>
  );
}
