'use client';

import { useConfig } from '../../hooks/useConfig';
import Link from 'next/link';

export default function DashboardPage() {
  const { config, stats, loading } = useConfig();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Laden...</div>;
  }

  const automations = [
    { 
      href: '/proefles', 
      title: 'Proefles', 
      description: 'Automatische bevestiging voor nieuwe leads',
      count: stats.byType?.proefles || 0,
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-l-green-500'
    },
    { 
      href: '/opzegging', 
      title: 'Opzegging', 
      description: 'Win-back berichten bij opzeggingen',
      count: stats.byType?.opzegging || 0,
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-l-orange-500'
    },
    { 
      href: '/inactief', 
      title: 'Inactieve Leden', 
      description: 'Herinneringen na 30 en 60 dagen',
      count: (stats.byType?.inactief_30 || 0) + (stats.byType?.inactief_60 || 0),
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-l-purple-500'
    },
    { 
      href: '/verjaardagen', 
      title: 'Verjaardagen', 
      description: 'Automatische felicitaties',
      count: stats.byType?.verjaardag || 0,
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-l-blue-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welkom, {config.gymName}</h1>
        <p className="text-gray-500">Beheer je WhatsApp automations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Berichten verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">{stats.byStatus?.delivered || 0}</div>
          <div className="text-sm text-gray-500">Afgeleverd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-blue-600">{stats.byStatus?.sent || 0}</div>
          <div className="text-sm text-gray-500">Verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">{stats.deliveryRate}%</div>
          <div className="text-sm text-gray-500">Delivery rate</div>
        </div>
      </div>

      {/* Automations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Automations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`bg-white border border-gray-200 border-l-4 ${item.borderColor} rounded-xl p-5 hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                    {item.count}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">verstuurd</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-2">Hoe werkt het?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Proefles:</strong> Automatisch bericht bij nieuwe lead aanmelding</li>
          <li>• <strong>Opzegging:</strong> Win-back bericht bij opzegging (per reden)</li>
          <li>• <strong>Inactief:</strong> Herinnering na 30 en 60 dagen geen bezoek</li>
          <li>• <strong>Verjaardagen:</strong> Felicitatie op verjaardag (binnenkort)</li>
        </ul>
      </div>
    </div>
  );
}