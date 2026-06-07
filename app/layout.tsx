import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


const SITE_URL = "https://angkasakost.ormawaeksekutifpku.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "AngkasaKost | Informasi Kost Sekitar IPB Dramaga",
    template: "%s | AngkasaKost",
  },

  icons: {
    icon: "/kostalogo.png",
    shortcut: "/kostalogo.png",
    apple: "/kostalogo.png",
  },

  description:
    "AngkasaKost membantu mahasiswa baru IPB menemukan informasi kost sekitar Kampus IPB Dramaga berdasarkan wilayah, harga, fasilitas, dan jarak ke kampus.",

  applicationName: "AngkasaKost",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "AngkasaKost",
    title: "AngkasaKost | Informasi Kost Sekitar IPB Dramaga",
    description:
      "Temukan informasi kost sekitar Kampus IPB Dramaga berdasarkan wilayah, harga, fasilitas, dan jarak ke kampus.",
    images: [
      {
        url: "/kostalogo.png",
        width: 1200,
        height: 630,
        alt: "AngkasaKost - Informasi Kost Sekitar IPB Dramaga",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AngkasaKost | Informasi Kost Sekitar IPB Dramaga",
    description:
      "Temukan informasi kost sekitar Kampus IPB Dramaga berdasarkan wilayah, harga, fasilitas, dan jarak ke kampus.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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

        <Toaster position="top-right" richColors duration={1500} />
      </body>
    </html>
  );
}