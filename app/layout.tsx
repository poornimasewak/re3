import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Re3 - Reduce Reuse Recycle",
  description: "Scan products to discover sustainability information, recycling instructions, and eco-friendly alternatives. Make better choices for the planet.",
  keywords: ["recycling", "sustainability", "eco-friendly", "barcode scanner", "environmental impact"],
  authors: [{ name: "Re3 Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#20B2AA",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Re3 - Reduce Reuse Recycle",
    description: "Scan products for sustainability insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Navigation />
      </body>
    </html>
  );
}
