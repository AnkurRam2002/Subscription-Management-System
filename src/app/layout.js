import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { DataProvider } from "@/contexts/DataContext";
import MainContent from "@/components/MainContent";

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
  description: "Manage all your subscriptions in one place"
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-slate-50`}
      >
        <DataProvider>
          <SidebarProvider>
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
          </SidebarProvider>
        </DataProvider>
      </body>
    </html>
  );
}
