import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'EncontreUm - Encontre Profissionais e Servicos',
  description: 'O maior diretorio de profissionais e servicos do Brasil. Conectamos voce aos melhores profissionais da sua cidade. Mecanicos, eletricistas, encanadores, advogados e mais.',
  keywords: 'profissionais, servicos, mecanico, eletricista, encanador, advogado, dentista, contador, Brasil',
  generator: 'v0.app',
  openGraph: {
    title: 'EncontreUm - Encontre Profissionais e Servicos',
    description: 'O maior diretorio de profissionais e servicos do Brasil.',
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
