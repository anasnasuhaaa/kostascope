import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AngkasaKost",
    template: "%s - AngkasaKost",
  },
  description:
    "Platform informasi kost untuk membantu mahasiswa menemukan hunian yang sesuai di sekitar IPB.",
  icons: {
    icon: "/kostalogo.png",
    shortcut: "/kostalogo.png",
    apple: "/kostalogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}

        <Toaster position="top-right" richColors duration={1500}/>
      </body>
    </html>
  );
}