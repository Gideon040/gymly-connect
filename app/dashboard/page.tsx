'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, byType: {}, byStatus: {} });
  const [loading, setLoading] = useState(true);

  // Later: haal gym uit auth/session
  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await fetch(`/api/stats?gym=${gymSlug}`);
      const data = await res.json();
      setStats(data.stats || { total: 0, byType: {}, byStatus: {} });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  const automations = [
    { 
      href: '/dashboard/proefles', 
      title: 'Proefles', 
      description: 'Automatische bevestiging voor nieuwe leads',
      count: stats.byType?.proefles || 0,
      color: 'bg-green-100 text-green-700'
    },
    { 
      href: '/dashboard/opzegging', 
      title: 'Opzegging', 
      description: 'Win-back berichten bij opzeggingen',
      count: stats.byType?.opzegging || 0,
      color: 'bg-orange-100 text-orange-700'
    },
    { 
      href: '/dashboard/inactief', 
      title: 'Inactieve Leden', 
      description: 'Herinneringen na 30 en 60 dagen',
      count: (stats.byType?.inactief_30 || 0) + (stats.byType?.inactief_60 || 0),
      color: 'bg-purple-100 text-purple-700'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Beheer je WhatsApp automations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Berichten deze maand</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">
            {stats.byStatus?.delivered || 0}
          </div>
          <div className="text-sm text-gray-500">Afgeleverd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">
            {stats.total > 0 
              ? Math.round(((stats.byStatus?.delivered || 0) / stats.total) * 100) 
              : 0}%
          </div>
          <div className="text-sm text-gray-500">Delivery rate</div>
        </div>
      </div>

      {/* Automations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Automations</h2>
        <div className="grid grid-cols-1 gap-4">
          {automations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                  {item.count} verstuurd
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}