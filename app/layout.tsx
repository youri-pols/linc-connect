import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LiNC Connect",
  description: "Het interne communityplatform van LiNC",
  // iOS home-screen title (emits <meta name="apple-mobile-web-app-title" />)
  appleWebApp: {
    title: "LiNC Connect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full bg-purple/5">{children}</body>
    </html>
  );
}
