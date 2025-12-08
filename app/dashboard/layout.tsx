'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Overzicht' },
  { href: '/dashboard/proefles', label: 'Proefles' },
  { href: '/dashboard/opzegging', label: 'Opzegging' },
  { href: '/dashboard/inactief', label: 'Inactieve Leden' },
  { href: '/dashboard/stats', label: 'Statistieken' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Later: haal gym uit auth/session
  const gym = {
    name: 'Potentia Gym',
    slug: 'potentia-gym',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col z-50">
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-gray-900 block">GymlyConnect</span>
              <span className="text-[11px] text-gray-400">WhatsApp Automations</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-3 py-2">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Gym Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">
                {gym.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{gym.name}</div>
              <div className="text-xs text-gray-400">Sandbox Mode</div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-60 p-8">
        <div className="max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}