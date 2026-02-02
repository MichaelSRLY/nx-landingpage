import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora GmbH – Generalunternehmer für Energie & Infrastruktur",
  description: "Ihr Generalunternehmer für komplexe Energie-, Elektro- und Infrastrukturprojekte. Ein Ansprechpartner – von der Anfrage bis zur Abnahme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
