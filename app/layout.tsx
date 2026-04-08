import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LiNC Connect",
  description: "Het interne communityplatform van LiNC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        <SidebarNav />
        <main className="flex-1 ml-60 p-8 bg-background min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
