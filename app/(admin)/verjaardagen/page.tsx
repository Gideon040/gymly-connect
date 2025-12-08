'use client';

import { useConfig } from '../../hooks/useConfig';

export default function VerjaardagenPage() {
  const { config, stats, loading, updateConfig, saveConfig, saved } = useConfig();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Laden...</div>;
  }

  const verjaardagCount = stats.byType?.verjaardag || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500">Leden met geboortedatum</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">{verjaardagCount}</div>
          <div className="text-sm text-gray-500">Felicitaties verstuurd</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">-</div>
          <div className="text-sm text-gray-500">Jarigen vandaag</div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <span>⚠️</span>
        <div className="text-sm text-yellow-800">
          <strong>Data niet beschikbaar:</strong> De Gymly API retourneert momenteel geen 
          geboortedatums. We hebben contact opgenomen met Gymly support om dit op te lossen.
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Verjaardagsbericht</h2>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            In afwachting van data
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
                <input
                  type="text"
                  value={config.birthdayDate}
                  onChange={(e) => updateConfig({ birthdayDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Bijv. vandaag jarig"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Felicitatiebericht</label>
                <textarea
                  value={config.birthdayMessage}
                  onChange={(e) => updateConfig({ birthdayMessage: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Je verjaardagsbericht..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-gray-800">
                  <strong>{config.gymName}</strong> - {config.birthdayDate}
                  <br /><br />
                  {config.birthdayMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <span>ℹ️</span>
        <div className="text-sm text-blue-800">
          <strong>Hoe werkt het?</strong> Zodra Gymly de geboortedatums beschikbaar maakt, 
          ontvangen leden automatisch een felicitatie op hun verjaardag om 08:00.
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