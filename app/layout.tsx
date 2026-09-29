import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.encontreum.online"),
  title: {
    default: "Encontre Um | Serviços, profissionais e negócios perto de você",
    template: "%s | Encontre Um",
  },
  description:
    "Encontre serviços, profissionais e negócios na sua região. Pesquise o que precisa e descubra opções para entrar em contato.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Encontre Um | Serviços, profissionais e negócios perto de você",
    description:
      "Pesquise o que precisa, informe sua região e encontre opções de atendimento.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.encontreum.online",
    siteName: "Encontre Um",
  },
  twitter: {
    card: "summary_large_image",
    title: "Encontre Um",
    description: "Serviços, profissionais e negócios perto de você.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
