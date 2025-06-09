import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  Bebas_Neue,
  JetBrains_Mono,
  Oswald,
  Roboto_Condensed,
} from "next/font/google";
import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
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
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} ${oswald.variable} ${robotoCondensed.variable} antialiased`}
      >
        <SessionProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
