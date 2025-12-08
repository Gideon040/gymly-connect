'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConfigProvider } from '../hooks/useConfig';

const navItems = [
  {
    section: 'Automations',
    items: [
      { href: '/proefles', label: 'Proefles', icon: '📱' },
      { href: '/opzegging', label: 'Opzegging', icon: '👋' },
      { href: '/inactief', label: 'Inactieve Leden', icon: '😴' },
      { href: '/verjaardagen', label: 'Verjaardagen', icon: '🎂' },
    ],
  },
  {
    section: 'Systeem',
    items: [
      { href: '/test', label: 'Testen', icon: '🧪' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col z-50">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-gray-900 block">GymlyConnect</span>
              <span className="text-[11px] text-gray-400">WhatsApp Automations</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {navItems.map((section) => (
              <div key={section.section} className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-3 py-2">
                  {section.section}
                </div>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">PG</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Potentia Gym</div>
                <div className="text-xs text-gray-400">Sandbox Mode</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-60">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {navItems.flatMap(s => s.items).find(i => i.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Beheer je automations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Verbonden
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                📖 Documentatie
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}