import ExternalFooter from "@/components/ExternalFooter";
import React from "react";

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
      <ExternalFooter />
    </main>
  );
}

export default WebsiteLayout;
