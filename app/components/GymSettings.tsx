'use client';

import { useConfig } from '../hooks/useConfig';

export default function GymSettings() {
  const { config, updateConfig } = useConfig();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">🏋️ Gym Instellingen</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gym Naam</label>
          <input
            type="text"
            value={config.gymName}
            onChange={(e) => updateConfig({ gymName: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Telefoonnummer</label>
          <input
            type="text"
            value={config.testPhone}
            onChange={(e) => updateConfig({ testPhone: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
}