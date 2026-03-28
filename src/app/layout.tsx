import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ALC — AI Learning Companion',
  description: 'A personalized learning space for curious minds',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body style={{
        margin: 0, padding: 0,
        background: '#FDFBF7',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: '#2D2A26',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
      }}>
        <main id="main-content" style={{ display: 'contents' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
