import type { Metadata } from "next";
import { Abhaya_Libre } from "next/font/google";
import "./globals.css";

const abhayaLibre = Abhaya_Libre({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: "800",
});

export const metadata: Metadata = {
  title: "Mockup Studio",
  description: "Editor de mockups com export transparente em PNG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <body className={abhayaLibre.variable}>{children}</body>
    </html>
  );
}
