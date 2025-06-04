import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { SessionProvider } from "next-auth/react";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoX",
  description:
    "Create, send, and track professional invoices in seconds. InvoX streamlines your billing process with automated reminders, payment tracking, and beautiful invoice templates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <SessionProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
