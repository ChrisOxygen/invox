import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingToastProps {
  title?: string;
  description?: string;
}

export function LoadingToast({
  title = "Loading",
  description,
}: LoadingToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border-2 border-blue-200 rounded-xl shadow-lg shadow-blue-100/50 min-w-[320px] max-w-[400px]">
      {/* Loading Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-full flex items-center justify-center mt-0.5">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
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

      {/* Animated Brand Accent */}
      <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
