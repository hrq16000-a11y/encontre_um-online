import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Encontre Um | O Diretório Local de Negócios',
  description: 'A conexão mais rápida entre você e quem resolve. Encontre dentistas, mecânicos, restaurantes e mais negócios locais. Cadastro com IA em segundos.',
  keywords: 'diretório local, negócios, dentistas, mecânicos, restaurantes, WhatsApp, contato direto, Brasil',
  generator: 'v0.app',
  openGraph: {
    title: 'Encontre Um | O Diretório Local de Negócios',
    description: 'A conexão mais rápida entre você e quem resolve.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
