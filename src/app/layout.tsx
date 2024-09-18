import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import SessionProvider from "@/providers/session-provider";
import { Analytics } from "@vercel/analytics/react";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hoku Faucet",
  description: "Request tHOKU from the Hoku faucet",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${spaceMono.className} antialiased`}>
        <SessionProvider session={session}>
          {children}
          <Analytics />
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
