'use client';

import { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../components/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { config, stats, loading, refetch } = useConfig();
  
  // Onboarding state
  const [gym, setGym] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [gymName, setGymName] = useState('');
  const [gymlyApiKey, setGymlyApiKey] = useState('');
  const [gymlyBusinessId, setGymlyBusinessId] = useState('');
  const [testPhone, setTestPhone] = useState('');

  // Load gym data
  useEffect(() => {
    async function loadGym() {
      if (!user) return;
      
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) {
        setGym(data);
        setGymName(data.name === 'Mijn Gym' ? '' : data.name);
        setGymlyApiKey(data.gymly_api_key || '');
        setGymlyBusinessId(data.gymly_business_id || '');
        setTestPhone(data.settings?.testPhone || '');
      }
    }

    loadGym();
  }, [user]);

  // Check if onboarding is complete
  const isOnboarded = gym?.status === 'active' && gym?.gymly_api_key && gym?.name !== 'Mijn Gym';

  // Save gym settings
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!gymName.trim()) {
      setError('Vul je gym naam in');
      setSaving(false);
      return;
    }

    const slug = gymName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { error: updateError } = await supabase
      .from('gyms')
      .update({
        name: gymName,
        slug: slug,
        gymly_api_key: gymlyApiKey || null,
        gymly_business_id: gymlyBusinessId || null,
        settings: { testPhone: testPhone || null },
        status: gymlyApiKey ? 'active' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', gym.id);

    if (updateError) {
      setError('Opslaan mislukt: ' + updateError.message);
    } else {
      setSuccess('Instellingen opgeslagen!');
      // Refresh gym data
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gym.id)
        .single();
      if (data) setGym(data);
      refetch?.();
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  // Onboarding view
  if (!isOnboarded) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welkom bij GymlyConnect!</h1>
          <p className="text-gray-500 mt-2">Vul je gegevens in om te starten met WhatsApp automations</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${gymName ? 'bg-purple-600' : 'bg-gray-200'}`} />
          <div className={`w-12 h-1 ${gymlyApiKey ? 'bg-purple-600' : 'bg-gray-200'}`} />
          <div className={`w-3 h-3 rounded-full ${gymlyApiKey ? 'bg-purple-600' : 'bg-gray-200'}`} />
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          {/* Error/Success */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Gym Info */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Gym Informatie
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gym Naam *</label>
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Bijv. Potentia Gym"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Telefoonnummer</label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+31612345678"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Voor het testen van berichten</p>
              </div>
            </div>
          </div>

          {/* Gymly Integration */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Gymly Koppeling
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gymly API Key</label>
                <input
                  type="text"
                  value={gymlyApiKey}
                  onChange={(e) => setGymlyApiKey(e.target.value)}
                  placeholder="gymly_api_..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gymly Business ID</label>
                <input
                  type="text"
                  value={gymlyBusinessId}
                  onChange={(e) => setGymlyBusinessId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 text-sm">Waar vind ik deze gegevens?</h4>
                <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                  <li>Log in op <a href="https://gymly.io" target="_blank" rel="noopener" className="underline">gymly.io</a></li>
                  <li>Ga naar Instellingen → API</li>
                  <li>Kopieer je API Key en Business ID</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-all"
            >
              {saving ? 'Opslaan...' : 'Opslaan en doorgaan'}
            </button>
            {!gymlyApiKey && (
              <p className="text-center text-sm text-gray-400 mt-3">
                Je kunt later ook je Gymly gegevens toevoegen
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }

  // Normal dashboard view
  const automations = [
    { 
      href: '/proefles', 
      title: 'Proefles', 
      description: 'Automatische bevestiging voor nieuwe leads',
      count: stats.byType?.proefles || 0,
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-l-green-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
    { 
      href: '/opzegging', 
      title: 'Opzegging', 
      description: 'Win-back berichten bij opzeggingen',
      count: stats.byType?.opzegging || 0,
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-l-orange-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      href: '/inactief', 
      title: 'Inactieve Leden', 
      description: 'Herinneringen na 30 en 60 dagen',
      count: (stats.byType?.inactief_30 || 0) + (stats.byType?.inactief_60 || 0),
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-l-purple-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      href: '/verjaardagen', 
      title: 'Verjaardagen', 
      description: 'Automatische felicitaties',
      count: stats.byType?.verjaardag || 0,
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-l-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{config.gymName}</p>
        </div>
        <Link
          href="/instellingen"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
        >
          Instellingen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Totaal verstuurd</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Afgeleverd</span>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.byStatus?.delivered || 0}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Delivery rate</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.deliveryRate}%</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Deze maand</span>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.thisMonth || 0}</div>
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
              className={`bg-white border border-gray-200 border-l-4 ${item.borderColor} rounded-xl p-5 hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                  <p className="text-xs text-gray-400">verstuurd</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Connecties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <span className="text-sm font-bold text-purple-600">G</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Gymly</span>
            </div>
            {gym?.gymly_api_key ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Verbonden
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                Niet verbonden
              </span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">WhatsApp</span>
            </div>
            {gym?.whatsapp_number ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {gym.whatsapp_number}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                Niet verbonden
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}