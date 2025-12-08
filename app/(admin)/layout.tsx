'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConfigProvider } from '../hooks/useConfig';

const navItems = [
  { href: '/proefles', label: '📱 Proefles' },
  { href: '/opzegging', label: '👋 Opzegging' },
  { href: '/inactief', label: '😴 Inactieve Leden' },
  { href: '/verjaardagen', label: '🎂 Verjaardagen' },
  { href: '/test', label: '🧪 Testen' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/proefles">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">GymlyConnect</h1>
                  <p className="text-sm text-gray-500">WhatsApp Automation Dashboard</p>
                </div>
              </Link>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Verbonden
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 font-medium text-sm transition border-b-2 -mb-px ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </ConfigProvider>
  );
}
