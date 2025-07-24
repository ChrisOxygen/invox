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
  });

  // Calculate responsive default zoom based on container width
  const calculateAutoZoom = useCallback((containerWidth: number): number => {
    const optimalWidth = 700; // Ideal template display width
    if (containerWidth < 500) return 60;
    if (containerWidth < 650) return 75;
    if (containerWidth < 800) return 85;
    return Math.min(100, Math.floor((containerWidth / optimalWidth) * 100));
  }, []);

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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoomState.currentZoom <= zoomState.minZoom}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoomState.currentZoom}%
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoomState.currentZoom >= zoomState.maxZoom}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetToAutoFit}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Auto Fit
        </Button>
      </div>

      {/* Template Preview */}
      <ScrollArea className="h-[calc(100vh-200px)] w-full pl-5 pr-10">
        <div
          className="py-6 overflow-hidden transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomState.currentZoom / 100})`,
            transformOrigin: "top left",
          }}
        >
          <MainTemplate />
        </div>
      </ScrollArea>
    </div>
  );
};

export default InvoiceTemplatePreview;
