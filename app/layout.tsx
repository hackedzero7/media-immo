import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AuthSessionProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MEDIA IMMO",
  description: "Real State Media Buissness",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthSessionProvider>
        <Suspense fallback={null}>
        <div className="min-h-screen">
          <Header />
          {children}
          <Footer />
          </div>
        </Suspense>
        </AuthSessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
