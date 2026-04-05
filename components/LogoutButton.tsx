'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all text-left w-full border border-transparent hover:border-red-500/20 active:scale-95 duration-150"
    >
      <LogOut size={18} />
      <span>Secure Logout</span>
    </button>
  )
}
