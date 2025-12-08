'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Gym {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
}

interface OverviewStats {
  totalGyms: number;
  activeGyms: number;
  totalMessages: number;
  messagesThisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats>({
    totalGyms: 0,
    activeGyms: 0,
    totalMessages: 0,
    messagesThisMonth: 0,
  });
  const [recentGyms, setRecentGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      setStats(data.stats);
      setRecentGyms(data.recentGyms || []);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overzicht van alle gyms en berichten</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">{stats.totalGyms}</div>
          <div className="text-sm text-gray-500">Totaal Gyms</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">{stats.activeGyms}</div>
          <div className="text-sm text-gray-500">Actieve Gyms</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.totalMessages}</div>
          <div className="text-sm text-gray-500">Totaal Berichten</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-orange-600">{stats.messagesThisMonth}</div>
          <div className="text-sm text-gray-500">Deze Maand</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h2>
        <div className="flex gap-3">
          <Link
            href="/admin/gyms/new"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all"
          >
            + Nieuwe Gym
          </Link>
          <Link
            href="/admin/logs"
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Bekijk Logs
          </Link>
        </div>
      </div>

      {/* Recent Gyms */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recente Gyms</h2>
          <Link href="/admin/gyms" className="text-sm text-orange-600 hover:text-orange-700">
            Bekijk alle →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentGyms.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nog geen gyms toegevoegd
            </div>
          ) : (
            recentGyms.map((gym) => (
              <Link
                key={gym.id}
                href={`/admin/gyms/${gym.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {gym.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{gym.name}</div>
                    <div className="text-sm text-gray-500">{gym.slug}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gym.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : gym.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {gym.status}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}