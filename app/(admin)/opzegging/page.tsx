'use client';

import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import GymSettings from '../../components/GymSettings';
import ConfigCard from '../../components/ConfigCard';
import MessagePreview from '../../components/MessagePreview';

const CANCELLATION_REASONS = [
  { value: 'HIGH_COST', label: '💰 Te duur', category: 'Kosten' },
  { value: 'FOUND_CHEAPER_ALTERNATIVE', label: '💸 Goedkoper gevonden', category: 'Kosten' },
  { value: 'FINANCIAL_HARDSHIP', label: '📉 Financiële problemen', category: 'Kosten' },
  { value: 'LACK_OF_PROGRESS', label: '📊 Geen vooruitgang', category: 'Motivatie' },
  { value: 'SLOW_RESULTS', label: '🐢 Langzame resultaten', category: 'Motivatie' },
  { value: 'LOST_INTEREST', label: '😴 Interesse verloren', category: 'Motivatie' },
  { value: 'FEELING_OVERWHELMED', label: '😰 Overweldigd', category: 'Motivatie' },
  { value: 'TIME_CONSTRAINTS', label: '⏰ Geen tijd', category: 'Tijd/Locatie' },
  { value: 'INCONVENIENT_HOURS', label: '🕐 Onhandige tijden', category: 'Tijd/Locatie' },
  { value: 'LOCATION_CHANGE', label: '🏠 Verhuisd', category: 'Tijd/Locatie' },
  { value: 'COMMUTING_DIFFICULTY', label: '🚗 Reistijd', category: 'Tijd/Locatie' },
  { value: 'LACK_OF_COMMUNITY', label: '👥 Geen community', category: 'Sociaal' },
  { value: 'FRIENDS_LEFT', label: '👋 Vrienden weg', category: 'Sociaal' },
  { value: 'UNWELCOMING_ENVIRONMENT', label: '😕 Onwelkom gevoel', category: 'Sociaal' },
  { value: 'POOR_COMMUNICATION', label: '📵 Slechte communicatie', category: 'Service' },
  { value: 'LACK_OF_ATTENTION', label: '👀 Te weinig aandacht', category: 'Service' },
  { value: 'GENERAL_DISSATISFACTION', label: '👎 Algemeen ontevreden', category: 'Service' },
  { value: 'EQUIPMENT_ISSUES', label: '🏋️ Apparatuur problemen', category: 'Service' },
  { value: 'CLEANLINESS_CONCERNS', label: '🧹 Hygiëne zorgen', category: 'Service' },
  { value: 'HEALTH_ISSUES', label: '🏥 Gezondheidsproblemen', category: 'Persoonlijk' },
  { value: 'MAJOR_LIFE_CHANGE', label: '🔄 Grote verandering', category: 'Persoonlijk' },
  { value: 'TRAVEL_FREQUENCY', label: '✈️ Veel op reis', category: 'Persoonlijk' },
  { value: 'SELF_SUFFICIENT', label: '💪 Zelfstandig verder', category: 'Overig' },
  { value: 'SEASONAL_MEMBER', label: '🌞 Seizoenslid', category: 'Overig' },
  { value: 'BETTER_ALTERNATIVE', label: '🔀 Beter alternatief', category: 'Overig' },
  { value: 'OTHER', label: '❓ Anders', category: 'Overig' },
];

export default function OpzeggingPage() {
  const { config, updateCancelResponse, saveConfig, saved } = useConfig();
  const [selectedReason, setSelectedReason] = useState('HIGH_COST');

  const groupedReasons = CANCELLATION_REASONS.reduce((acc, reason) => {
    if (!acc[reason.category]) acc[reason.category] = [];
    acc[reason.category].push(reason);
    return acc;
  }, {} as Record<string, typeof CANCELLATION_REASONS>);

  const currentResponse = config.cancelResponses[selectedReason];

  return (
    <div className="space-y-6">
      <GymSettings />

      <ConfigCard title="👋 Opzegging Berichten per Reden">
        <div className="space-y-6">
          {/* Reason Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Selecteer opzeggingsreden:</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 bg-white"
            >
              {Object.entries(groupedReasons).map(([category, reasons]) => (
                <optgroup key={category} label={category}>
                  {reasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Edit Response */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">
              {CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
              <input
                type="text"
                value={currentResponse?.date || ''}
                onChange={(e) => updateCancelResponse(selectedReason, 'date', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
              <textarea
                value={currentResponse?.message || ''}
                onChange={(e) => updateCancelResponse(selectedReason, 'message', e.target.value)}
                className="w-full border rounded-lg px-4 py-2 h-24"
              />
            </div>
          </div>

          <MessagePreview 
            date={currentResponse?.date || ''} 
            message={currentResponse?.message || ''} 
            color="orange" 
          />
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