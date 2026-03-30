import ExternalFooter from "@/components/ExternalFooter";
import { ExternalNavMenu } from "@/components/ExternalNavMenu";
import React from "react";

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ExternalNavMenu />
      {children}
      <ExternalFooter />
    </main>
  );
}

export default WebsiteLayout;
