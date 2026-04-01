'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, Trophy, Heart, Award, BarChart3, LogOut, Menu, X } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (data?.role !== 'admin') router.push('/dashboard')
    }
    checkAdmin()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/draws', label: 'Draws', icon: Trophy },
    { href: '/admin/charities', label: 'Charities', icon: Heart },
    { href: '/admin/winners', label: 'Winners', icon: Award },
  ]

  const NavLinks = () => (
    <>
      {navItems.map(item => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={18} /> {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 gap-2">
        <div className="mb-6 px-2">
          <p className="text-xl font-bold text-purple-400">GolfGives</p>
          <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
        </div>
        <NavLinks />
        <div className="mt-auto">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-400 hover:text-white gap-3">
            <LogOut size={18} /> Log Out
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-purple-400">Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-16 px-4 flex flex-col gap-2">
          <NavLinks />
          <Button variant="ghost" onClick={handleLogout} className="justify-start text-slate-400 gap-3 mt-4">
            <LogOut size={18} /> Log Out
          </Button>
        </div>
      )}

      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">{children}</main>
    </div>
  )
}