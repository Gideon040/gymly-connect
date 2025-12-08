'use client';

import { useState, useEffect } from 'react';

interface Log {
  id: string;
  type: string;
  recipient_name: string | null;
  recipient_phone: string;
  status: string;
  sent_at: string;
}

interface Stats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, byType: {}, byStatus: {} });
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch(`/api/stats?gym=${gymSlug}`),
        fetch(`/api/dashboard/logs?gym=${gymSlug}`),
      ]);
      
      const statsData = await statsRes.json();
      const logsData = await logsRes.json();
      
      setStats(statsData.stats || { total: 0, byType: {}, byStatus: {} });
      setLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      proefles: 'Proefles',
      opzegging: 'Opzegging',
      inactief_30: 'Inactief 30d',
      inactief_60: 'Inactief 60d',
      verjaardag: 'Verjaardag',
    };
    return labels[type] || type;
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistieken</h1>
        <p className="text-gray-500">Overzicht van de afgelopen 30 dagen</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Totaal verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">{stats.byType?.proefles || 0}</div>
          <div className="text-sm text-gray-500">Proefles</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-orange-600">{stats.byType?.opzegging || 0}</div>
          <div className="text-sm text-gray-500">Opzegging</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">
            {(stats.byType?.inactief_30 || 0) + (stats.byType?.inactief_60 || 0)}
          </div>
          <div className="text-sm text-gray-500">Inactief</div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recente berichten</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nog geen berichten verstuurd
            </div>
          ) : (
            logs.slice(0, 10).map((log) => (
              <div key={log.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {log.recipient_name || log.recipient_phone}
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(log.sent_at)}</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {getTypeLabel(log.type)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}