'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Gym {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: string;
  whatsapp_number: string | null;
  created_at: string;
}

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGyms();
  }, []);

  async function loadGyms() {
    try {
      const res = await fetch('/api/admin/gyms');
      const data = await res.json();
      setGyms(data.gyms || []);
    } catch (error) {
      console.error('Failed to load gyms:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gyms</h1>
          <p className="text-gray-500">Beheer alle aangesloten gyms</p>
        </div>
        <Link
          href="/admin/gyms/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all"
        >
          + Nieuwe Gym
        </Link>
      </div>

      {/* Gyms Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gym</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">WhatsApp</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aangemaakt</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gyms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nog geen gyms toegevoegd
                </td>
              </tr>
            ) : (
              gyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {gym.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{gym.name}</div>
                        <div className="text-sm text-gray-500">{gym.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gym.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : gym.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : gym.status === 'onboarding'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {gym.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {gym.whatsapp_number ? (
                      <span className="text-sm text-gray-900">{gym.whatsapp_number}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Niet ingesteld</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(gym.created_at).toLocaleDateString('nl-NL')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/gyms/${gym.id}`}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Bewerken
                    </Link>
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