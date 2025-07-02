"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainTemplate from "./templates/MainTemplate";

export function InvoiceDisplay() {
  return (
    <div className="h-full bg-gray-100 p-6">
      <ScrollArea className="h-[calc(100vh-200px)] w-full">
        <div className="flex justify-center">
          <div className=" origin-top transform">
            <MainTemplate previewMode={true} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
