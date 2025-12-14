import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pravo Quiz - Průběžný test z práva",
  description: "Interaktivní aplikace pro procvičování právních otázek z občanského, trestního a správního práva. Sbírej hundy a staň se právním expertem!",
  keywords: ["právo", "quiz", "test", "NOZ", "trestní právo", "správní právo"],
  authors: [{ name: "Pravo Quiz Team" }],
  openGraph: {
    title: "Pravo Quiz",
    description: "Procvič si právo zábavnou formou!",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
