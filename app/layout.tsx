import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "Kitchen",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/food.svg",
    apple: "/icons/food.svg",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Kitchen" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F0",
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
    <html lang="en">
      <body>
        <RegisterSW />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
