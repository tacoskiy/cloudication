import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/features/layout/components/Header";

import AppProviders from "@/features/shared/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "クモ二ケーション",
  description: "匿名雲投稿アプリ",
};

export default function RootLayout({ children }:Readonly<{ children: React.ReactNode; }>){
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header/>
        <AppProviders>
          <main>
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
