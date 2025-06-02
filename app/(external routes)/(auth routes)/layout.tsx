import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" p-3 h-screen w-full bg-black grid grid-cols-2">
      <div className=""></div>
      <div className=" col-start-2">{children}</div>
    </main>
  );
}

export default AuthLayout;
