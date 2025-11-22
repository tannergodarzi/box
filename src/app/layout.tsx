import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Box Breathing | A Calm Way To Breathe",
  description: "Practice box breathing to reduce stress and anxiety. A simple guided breathing technique that helps you find calm and improve focus in moments.",
  openGraph: {
    title: "Box Breathing | A Calm Way To Breathe",
    description: "Practice box breathing to reduce stress and anxiety. A simple guided breathing technique that helps you find calm and improve focus in moments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
