import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

const beVietnam = Be_Vietnam_Pro({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'AI Learning Companion',
  description: 'Your personal learning companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${beVietnam.variable} antialiased`} style={{ background: '#FFF8F1', fontFamily: 'var(--font-body), Be Vietnam Pro, sans-serif' }}>
        <main style={{ paddingBottom: 80 }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
