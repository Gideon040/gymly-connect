'use client';

import { useConfig } from '../../hooks/useConfig';
import GymSettings from '../../components/GymSettings';
import ConfigCard from '../../components/ConfigCard';
import MessagePreview from '../../components/MessagePreview';

export default function VerjaardagenPage() {
  const { config, updateConfig, saveConfig, saved } = useConfig();

  return (
    <div className="space-y-6">
      <GymSettings />

      <ConfigCard title="🎂 Verjaardag Bericht">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
            <input
              type="text"
              value={config.birthdayMessage?.date || 'vandaag jarig'}
              onChange={(e) => updateConfig({ 
                birthdayMessage: { ...config.birthdayMessage, date: e.target.value } 
              })}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Felicitatie bericht</label>
            <textarea
              value={config.birthdayMessage?.message || ''}
              onChange={(e) => updateConfig({ 
                birthdayMessage: { ...config.birthdayMessage, message: e.target.value } 
              })}
              className="w-full border rounded-lg px-4 py-2 h-24"
            />
          </div>
          <MessagePreview 
            date={config.birthdayMessage?.date || 'vandaag jarig'} 
            message={config.birthdayMessage?.message || ''} 
            color="blue" 
          />
        </div>
      </ConfigCard>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Info:</strong> De cron job draait dagelijks om 8:00 en stuurt automatisch felicitaties naar jarige leden.
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