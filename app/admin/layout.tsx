import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'miAROGYA Admin - Access Restricted' }

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
