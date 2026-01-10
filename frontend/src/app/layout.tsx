import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";

import AppProviders from "@/providers/AppProviders";
import ModalOverlay from "@/components/common/ModalOverlay";

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
      <AppProviders>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header/>
          <ModalOverlay/>
          <main>
            {children}
          </main>
        </body>
      </AppProviders>
    </html>
  );
}
