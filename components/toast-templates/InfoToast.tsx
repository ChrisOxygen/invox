import React from "react";
import { Info } from "lucide-react";

interface InfoToastProps {
  title?: string;
  description?: string;
}

export function InfoToast({ title = "Info", description }: InfoToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border-2 border-blue-200 rounded-xl shadow-lg shadow-blue-100/50 min-w-[320px] max-w-[400px]">
      {/* Info Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-full flex items-center justify-center mt-0.5">
        <Info className="w-5 h-5 text-blue-600" />
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

      {/* Brand Accent - Using your signature blue-cyan gradient */}
      <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
    </div>
  );
}
