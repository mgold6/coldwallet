import type { Metadata } from "next";

import "./globals.css";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ColdWallet",
  description: "ColdWallet Digital Asset Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body
        className="min-h-full flex flex-col font-sans"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <Providers>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}