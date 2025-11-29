import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoulOfLight",
  description: "Marketplace holístico en evolución",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-page min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
