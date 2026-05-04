import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Nursify – Trusted Home Nursing Care in Hyderabad',
  description: 'Book verified, licensed nurses for personalized home healthcare. Professional nursing care by the hour or day with complete transparency and trust.',
  keywords: 'nursing care, home nurse, healthcare, medical care, Hyderabad, nurse booking',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-medical-bg">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
