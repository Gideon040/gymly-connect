'use client';

import { useConfig } from '../../hooks/useConfig';

export default function ProeflesPage() {
  const { config, updateConfig, saveConfig, saved } = useConfig();

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-purple-600">24</div>
          <div className="text-sm text-gray-500">Berichten deze maand</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">92%</div>
          <div className="text-sm text-gray-500">Delivery rate</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">18</div>
          <div className="text-sm text-gray-500">Nieuwe leads</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span>⚙️</span> Instellingen
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gym Naam</label>
              <input
                type="text"
                value={config.gymName}
                onChange={(e) => updateConfig({ gymName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bijv. Potentia Gym"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Telefoonnummer</label>
              <input
                type="text"
                value={config.testPhone}
                onChange={(e) => updateConfig({ testPhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+31612345678"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span>💬</span> Bevestigingsbericht
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
              <input
                type="text"
                value={config.welcomeDate}
                onChange={(e) => updateConfig({ welcomeDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bijv. deze week"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
              <textarea
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-y"
                placeholder="Je welkomstbericht..."
              />
            </div>
            {/* Preview */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                💬 WhatsApp Preview
              </div>
              <div className="text-sm text-gray-800">
                <strong>{config.gymName}</strong> - {config.welcomeDate}
                <br /><br />
                {config.welcomeMessage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <span>ℹ️</span>
        <div className="text-sm text-blue-800">
          <strong>Hoe werkt het?</strong> Wanneer een nieuwe lead zich aanmeldt via Gymly, 
          ontvangt deze automatisch een WhatsApp bevestiging met bovenstaande tekst.
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveConfig}
        className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
          saved 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
      </button>
    </div>
  );
}