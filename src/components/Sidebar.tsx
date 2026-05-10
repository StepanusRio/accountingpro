'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users, FileText, PieChart, Activity, ChevronRight } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bagan Akun', href: '/accounts', icon: BookOpen },
  { name: 'Buku Pembantu', href: '/aux-accounts', icon: Users },
  { name: 'Jurnal Umum', href: '/journals', icon: FileText },
  { name: 'Buku Besar', href: '/ledger', icon: Activity },
  { name: 'Laporan', href: '/reports', icon: PieChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-border-default bg-surface-raised">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border-default">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#818cf8" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#818cf8" opacity="0.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#818cf8" opacity="0.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#818cf8" opacity="0.3" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-text-primary">Akuntansi</h1>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">Pro Edition</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold text-text-muted uppercase tracking-widest">Menu</p>
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-accent-500/12 text-accent-400'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }
                `}
              >
                <item.icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    isActive ? 'text-accent-400' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                  strokeWidth={1.8}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-accent-400/50" strokeWidth={2} />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border-default px-5 py-3">
        <p className="text-[11px] text-text-muted">v0.1.0 · Prisma ORM</p>
      </div>
    </aside>
  )
}
