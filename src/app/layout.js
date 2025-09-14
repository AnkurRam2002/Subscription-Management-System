import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";
import SidebarWrapper from "@/components/SidebarWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Subscription Manager",
  description: "Manage all your subscriptions in one place with analytics and insights",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Subscription Manager"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Subscription Manager" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ServiceWorkerProvider>
          <SidebarProvider>
            <DatabaseInitializer />
            <SidebarWrapper />
            {children}
          </SidebarProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
