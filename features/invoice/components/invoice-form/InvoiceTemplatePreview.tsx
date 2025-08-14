"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import MainTemplate from "../templates/MainTemplate";

interface ZoomState {
  currentZoom: number;
  isAutoZoom: boolean;
  containerWidth: number;
  minZoom: 25;
  maxZoom: 200;
  step: 25;
  baseFontSize: number; // Base font size in pixels for em calculation
}

const InvoiceTemplatePreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState<ZoomState>({
    currentZoom: 90,
    isAutoZoom: true,
    containerWidth: 0,
    minZoom: 25,
    maxZoom: 200,
    step: 25,
    baseFontSize: 16, // 16px base font size
  });

  // Calculate font size based on zoom percentage
  const calculateFontSize = useCallback(
    (zoomPercent: number): number => {
      return (zoomState.baseFontSize * zoomPercent) / 100;
    },
    [zoomState.baseFontSize]
  );

  // Calculate responsive default zoom based on container width
  const calculateAutoZoom = useCallback(
    (containerWidth: number): number => {
      const templateWidthEm = 49.625; // A4 width in em units (794px ÷ 16px)
      const baseFontSize = zoomState.baseFontSize;
      const templateWidthPx = templateWidthEm * baseFontSize;

      // Calculate optimal zoom to fit container with padding
      // Account for ScrollArea padding (pl-5 pr-10) and container margin
      const leftPadding = 20; // pl-5 = 1.25rem = 20px
      const rightPadding = 40; // pr-10 = 2.5rem = 40px
      const containerPadding = 48; // py-6 = 1.5rem = 24px top/bottom, so some margin
      const availableWidth =
        containerWidth - leftPadding - rightPadding - containerPadding;

      const optimalZoom = Math.floor((availableWidth / templateWidthPx) * 100);

      // Constrain to reasonable bounds
      return Math.max(50, Math.min(120, optimalZoom));
    },
    [zoomState.baseFontSize]
  );

  // Handle container resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (entry) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const containerWidth = entry.contentRect.width;
          setZoomState((prev) => {
            const newAutoZoom = calculateAutoZoom(containerWidth);
            return {
              ...prev,
              containerWidth,
              currentZoom: prev.isAutoZoom ? newAutoZoom : prev.currentZoom,
            };
          });
        }, 150);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [calculateAutoZoom]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      currentZoom: Math.min(prev.maxZoom, prev.currentZoom + prev.step),
      isAutoZoom: false,
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      currentZoom: Math.max(prev.minZoom, prev.currentZoom - prev.step),
      isAutoZoom: false,
    }));
  }, []);

  const resetToAutoFit = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      currentZoom: calculateAutoZoom(prev.containerWidth),
      isAutoZoom: true,
    }));
  }, [calculateAutoZoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "=") {
          e.preventDefault();
          zoomIn();
        } else if (e.key === "-") {
          e.preventDefault();
          zoomOut();
        } else if (e.key === "0") {
          e.preventDefault();
          resetToAutoFit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut, resetToAutoFit]);

  return (
    <div
      className="w-full bg-gray-100 h-full overflow-x-hidden"
      ref={containerRef}
    >
      {/* Zoom Controls Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-blue-100 px-2 sm:px-5 py-2 sm:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoomState.currentZoom <= zoomState.minZoom}
            className="h-7 w-7 sm:h-9 sm:w-9 p-0 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </Button>

          <span className="text-xs sm:text-sm font-semibold min-w-[50px] sm:min-w-[60px] text-center text-gray-700 bg-blue-50 px-2 sm:px-3 py-1 rounded-lg">
            {zoomState.currentZoom}%
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoomState.currentZoom >= zoomState.maxZoom}
            className="h-7 w-7 sm:h-9 sm:w-9 p-0 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetToAutoFit}
          className="flex items-center gap-1 sm:gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Auto Fit</span>
          <span className="sm:hidden">Fit</span>
        </Button>
      </div>

      {/* Template Preview */}
      <ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)] w-full pl-2 sm:pl-5 pr-4 sm:pr-10">
        <div
          className="py-6 overflow-hidden transition-all duration-300 ease-out"
          style={{
            fontSize: `${calculateFontSize(zoomState.currentZoom)}px`,
          }}
        >
          {/* Template Container with em-based styling */}
          <div
            className="bg-white border-2 border-gray-200 rounded-lg shadow-lg max-w-none overflow-hidden"
            style={{
              width: "49.625em", // A4 width in em units (794px ÷ 16px)
              margin: "0 auto",
              // All spacing and sizing will now scale with font-size
            }}
          >
            <MainTemplate />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default InvoiceTemplatePreview;
