'use client';

import { useConfig } from '../../hooks/useConfig';
import GymSettings from '../../components/GymSettings';
import ConfigCard from '../../components/ConfigCard';
import MessagePreview from '../../components/MessagePreview';

export default function InactiefPage() {
  const { config, updateInactiveResponse, saveConfig, saved } = useConfig();

  return (
    <div className="space-y-6">
      <GymSettings />

      <ConfigCard title="😴 Inactieve Leden - 30 dagen">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
            <input
              type="text"
              value={config.inactiveResponses['30']?.date || ''}
              onChange={(e) => updateInactiveResponse('30', 'date', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
            <textarea
              value={config.inactiveResponses['30']?.message || ''}
              onChange={(e) => updateInactiveResponse('30', 'message', e.target.value)}
              className="w-full border rounded-lg px-4 py-2 h-24"
            />
          </div>
          <MessagePreview 
            date={config.inactiveResponses['30']?.date || ''} 
            message={config.inactiveResponses['30']?.message || ''} 
            color="purple" 
          />
        </div>
      </ConfigCard>

      <ConfigCard title="😴😴 Inactieve Leden - 60 dagen">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
            <input
              type="text"
              value={config.inactiveResponses['60']?.date || ''}
              onChange={(e) => updateInactiveResponse('60', 'date', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
            <textarea
              value={config.inactiveResponses['60']?.message || ''}
              onChange={(e) => updateInactiveResponse('60', 'message', e.target.value)}
              className="w-full border rounded-lg px-4 py-2 h-24"
            />
          </div>
          <MessagePreview 
            date={config.inactiveResponses['60']?.date || ''} 
            message={config.inactiveResponses['60']?.message || ''} 
            color="purple" 
          />
        </div>
      </ConfigCard>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Info:</strong> De cron job draait dagelijks om 9:00 en verstuurt automatisch berichten naar leden die 30 of 60 dagen niet zijn geweest.
        </p>
      </div>

      <button
        onClick={saveConfig}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
      >
        {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
      </button>
    </div>
  );
}