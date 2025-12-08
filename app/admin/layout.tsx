'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Overzicht' },
  { href: '/admin/gyms', label: 'Gyms' },
  { href: '/admin/logs', label: 'Alle Logs' },
  { href: '/admin/settings', label: 'Instellingen' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-60 h-screen bg-gray-900 flex flex-col z-50">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-white block">GymlyConnect</span>
              <span className="text-[11px] text-gray-400">Super Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 px-3 py-2">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">GA</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Gideon Admin</div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-60">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}