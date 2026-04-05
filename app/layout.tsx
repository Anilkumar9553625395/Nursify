import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NurseCare – Quality Nursing Care, When You Need It',
  description: 'Book verified nurses for personalized home care by the hour or day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
