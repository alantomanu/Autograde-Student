import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import AppNavbar from "@/components/navbar";
import { Background } from "../components/background";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Autograde Student",
  description: "Student portal for Autograde",
  icons: {
    icon: {
      url: '/favicon.ico',
      sizes: '180x180',
    }
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Background>
          <AppNavbar />
          <div className="min-h-screen bg-transparent">
            {children}
          </div>
        </Background>
      </body>
    </html>
  );
}
