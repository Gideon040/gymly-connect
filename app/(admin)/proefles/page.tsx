'use client';

import { useConfig } from '../../hooks/useConfig';
import GymSettings from '../../components/GymSettings';
import ConfigCard from '../../components/ConfigCard';
import MessagePreview from '../../components/MessagePreview';

export default function ProeflesPage() {
  const { config, updateConfig, saveConfig, saved } = useConfig();

  return (
    <div className="space-y-6">
      <GymSettings />

      <ConfigCard title="💬 Proefles Bevestiging">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
            <input
              type="text"
              value={config.welcomeDate}
              onChange={(e) => updateConfig({ welcomeDate: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welkomst bericht</label>
            <textarea
              value={config.welcomeMessage}
              onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 h-24"
            />
          </div>
          <MessagePreview date={config.welcomeDate} message={config.welcomeMessage} color="green" />
        </div>
      </ConfigCard>

      <button
        onClick={saveConfig}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
      >
        {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
      </button>
    </div>
  );
}