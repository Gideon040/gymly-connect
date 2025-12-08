'use client';

import { useConfig } from '../../hooks/useConfig';

export default function InactiefPage() {
  const { config, stats, loading, updateInactiveResponse, saveConfig, saved } = useConfig();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Laden...</div>;
  }

  const inactiveConfig = config.inactiveResponses || {
    '30': { date: 'alweer 30 dagen', message: 'We missen je!' },
    '60': { date: 'al 60 dagen', message: 'Lang niet gezien!' },
  };

  const inactief30Count = stats.byType?.inactief_30 || 0;
  const inactief60Count = stats.byType?.inactief_60 || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5" style={{ borderLeft: '4px solid #7C3AED' }}>
          <div className="text-3xl font-bold text-purple-600">{inactief30Count + inactief60Count}</div>
          <div className="text-sm text-gray-500">Herinneringen verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-orange-600">{inactief30Count}</div>
          <div className="text-sm text-gray-500">30 dagen berichten</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-red-600">{inactief60Count}</div>
          <div className="text-sm text-gray-500">60 dagen berichten</div>
        </div>
      </div>

      {/* 30 Days */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">30 Dagen Inactief</h2>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            Eerste herinnering
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
                <input
                  type="text"
                  value={inactiveConfig['30']?.date || ''}
                  onChange={(e) => updateInactiveResponse('30', 'date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Bijv. alweer 30 dagen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
                <textarea
                  value={inactiveConfig['30']?.message || ''}
                  onChange={(e) => updateInactiveResponse('30', 'message', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Je motivatiebericht..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-sm text-gray-800">
                  <strong>{config.gymName}</strong> - {inactiveConfig['30']?.date}
                  <br /><br />
                  {inactiveConfig['30']?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 60 Days */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">60 Dagen Inactief</h2>
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Urgente herinnering
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
                <input
                  type="text"
                  value={inactiveConfig['60']?.date || ''}
                  onChange={(e) => updateInactiveResponse('60', 'date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Bijv. al 60 dagen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
                <textarea
                  value={inactiveConfig['60']?.message || ''}
                  onChange={(e) => updateInactiveResponse('60', 'message', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Je urgente motivatiebericht..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-sm text-gray-800">
                  <strong>{config.gymName}</strong> - {inactiveConfig['60']?.date}
                  <br /><br />
                  {inactiveConfig['60']?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <span>⏰</span>
        <div className="text-sm text-blue-800">
          <strong>Automatische check:</strong> De cron job draait dagelijks om 09:00 en 
          controleert welke leden 30 of 60 dagen niet zijn geweest. Elk lid ontvangt 
          maximaal 1 bericht per 7 dagen.
        </div>
      </div>

      {/* Save */}
      <button
        onClick={saveConfig}
        className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
          saved 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {saved ? '✓ Opgeslagen!' : 'Instellingen Opslaan'}
      </button>
    </div>
  );
}