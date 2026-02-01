import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile-hero-global.css";

export const metadata: Metadata = {
  title: "Regalitica",
  description: "Building Systems, Ventures, and Future Companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
