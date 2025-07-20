import React from "react";
import { XCircle } from "lucide-react";

interface ErrorToastProps {
  title?: string;
  description?: string;
}

export function ErrorToast({ title = "Error", description }: ErrorToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border-2 border-red-200 rounded-xl shadow-lg shadow-red-100/50 min-w-[320px] max-w-[400px]">
      {/* Error Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-full flex items-center justify-center mt-0.5">
        <XCircle className="w-5 h-5 text-red-600" />
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
      <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-red-500 to-rose-500 rounded-full"></div>
    </div>
  );
}
