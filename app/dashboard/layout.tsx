'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Trophy,
  Heart,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive')
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()
      if (data) setSubscriptionStatus(data.subscription_status)
    }
    getProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/scores', label: 'My Scores', icon: Trophy },
    { href: '/dashboard/charity', label: 'My Charity', icon: Heart },
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
              active
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 gap-2">
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-xl font-bold text-emerald-400">GolfGives</span>
          <Badge
            className={subscriptionStatus === 'active'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
            }
          >
            {subscriptionStatus}
          </Badge>
        </div>
        <NavLinks />
        <div className="mt-auto">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-slate-400 hover:text-white gap-3"
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-400">GolfGives</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-16 px-4 flex flex-col gap-2">
          <NavLinks />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="justify-start text-slate-400 hover:text-white gap-3 mt-4"
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}