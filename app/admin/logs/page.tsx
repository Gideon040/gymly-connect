'use client';

import { useState, useEffect } from 'react';

interface Log {
  id: string;
  gym_id: string;
  type: string;
  trigger_key: string | null;
  recipient_phone: string;
  recipient_name: string | null;
  status: string;
  error_message: string | null;
  sent_at: string;
  gyms: {
    name: string;
    slug: string;
  } | null;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  function getTypeColor(type: string) {
    const colors: Record<string, string> = {
      proefles: 'bg-green-100 text-green-700',
      opzegging: 'bg-orange-100 text-orange-700',
      inactief_30: 'bg-purple-100 text-purple-700',
      inactief_60: 'bg-purple-100 text-purple-700',
      verjaardag: 'bg-blue-100 text-blue-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      sent: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
      read: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
        <p className="text-gray-500">Alle verstuurde berichten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">{logs.length}</div>
          <div className="text-sm text-gray-500">Totaal berichten</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">
            {logs.filter(l => l.status === 'delivered' || l.status === 'read').length}
          </div>
          <div className="text-sm text-gray-500">Afgeleverd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-blue-600">
            {logs.filter(l => l.status === 'sent').length}
          </div>
          <div className="text-sm text-gray-500">Verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-red-600">
            {logs.filter(l => l.status === 'failed').length}
          </div>
          <div className="text-sm text-gray-500">Mislukt</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gym</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ontvanger</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nog geen berichten verstuurd
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(log.sent_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {log.gyms?.name || 'Onbekend'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                      {getTypeLabel(log.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {log.recipient_name || 'Onbekend'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.recipient_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    {log.error_message && (
                      <div className="text-xs text-red-500 mt-1">{log.error_message}</div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}