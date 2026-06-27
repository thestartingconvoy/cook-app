import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import RegisterSW from "@/components/RegisterSW";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Menu",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/food.svg",
    apple: "/icons/food.svg",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Menu" },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <RegisterSW />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
