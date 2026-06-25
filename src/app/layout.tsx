import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Real Estate Voice Agent Dashboard",
  description: "Modern Call Analytics Dashboard for Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex text-black bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pt-14 md:pt-0">
          {children}
        </div>
      </body>
    </html>
  );
}
