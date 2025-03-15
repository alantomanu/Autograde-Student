import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import AppNavbar from "@/components/navbar";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Autograde Student",
  description: "Student portal for Autograde",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <AppNavbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
