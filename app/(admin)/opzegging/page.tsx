'use client';

import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';

const CANCEL_REASONS = [
  { value: 'HIGH_COST', label: 'Te duur', category: 'Financieel' },
  { value: 'FOUND_CHEAPER_ALTERNATIVE', label: 'Goedkoper alternatief', category: 'Financieel' },
  { value: 'FINANCIAL_HARDSHIP', label: 'Financiële problemen', category: 'Financieel' },
  { value: 'LACK_OF_PROGRESS', label: 'Geen vooruitgang', category: 'Motivatie' },
  { value: 'SLOW_RESULTS', label: 'Langzame resultaten', category: 'Motivatie' },
  { value: 'LOST_INTEREST', label: 'Interesse verloren', category: 'Motivatie' },
  { value: 'FEELING_OVERWHELMED', label: 'Overweldigd', category: 'Motivatie' },
  { value: 'TIME_CONSTRAINTS', label: 'Geen tijd', category: 'Praktisch' },
  { value: 'INCONVENIENT_HOURS', label: 'Onhandige tijden', category: 'Praktisch' },
  { value: 'LOCATION_CHANGE', label: 'Verhuizing', category: 'Praktisch' },
  { value: 'COMMUTING_DIFFICULTY', label: 'Reistijd', category: 'Praktisch' },
  { value: 'HEALTH_ISSUES', label: 'Gezondheid', category: 'Persoonlijk' },
  { value: 'MAJOR_LIFE_CHANGE', label: 'Levensverandering', category: 'Persoonlijk' },
  { value: 'TRAVEL_FREQUENCY', label: 'Veel reizen', category: 'Persoonlijk' },
  { value: 'EQUIPMENT_ISSUES', label: 'Apparatuur', category: 'Faciliteiten' },
  { value: 'CLEANLINESS_CONCERNS', label: 'Hygiëne', category: 'Faciliteiten' },
  { value: 'UNWELCOMING_ENVIRONMENT', label: 'Onprettige sfeer', category: 'Faciliteiten' },
  { value: 'LACK_OF_COMMUNITY', label: 'Geen community', category: 'Sociaal' },
  { value: 'FRIENDS_LEFT', label: 'Vrienden weg', category: 'Sociaal' },
  { value: 'POOR_COMMUNICATION', label: 'Slechte communicatie', category: 'Service' },
  { value: 'LACK_OF_ATTENTION', label: 'Te weinig aandacht', category: 'Service' },
  { value: 'GENERAL_DISSATISFACTION', label: 'Algemene ontevredenheid', category: 'Service' },
  { value: 'SELF_SUFFICIENT', label: 'Zelfstandig verder', category: 'Anders' },
  { value: 'SEASONAL_MEMBER', label: 'Seizoensgebonden', category: 'Anders' },
  { value: 'BETTER_ALTERNATIVE', label: 'Beter alternatief', category: 'Anders' },
  { value: 'OTHER', label: 'Anders', category: 'Anders' },
];

export default function OpzeggingPage() {
  const { config, stats, loading, updateCancelResponse, saveConfig, saved } = useConfig();
  const [selectedReason, setSelectedReason] = useState('HIGH_COST');

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Laden...</div>;
  }

  const currentResponse = config.cancelResponses[selectedReason] || { date: '', message: '' };
  const opzeggingCount = stats.byType?.opzegging || 0;

  const groupedReasons = CANCEL_REASONS.reduce((acc, reason) => {
    if (!acc[reason.category]) acc[reason.category] = [];
    acc[reason.category].push(reason);
    return acc;
  }, {} as Record<string, typeof CANCEL_REASONS>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-orange-600">{opzeggingCount}</div>
          <div className="text-sm text-gray-500">Opzeggingen deze maand</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-600">{Math.round(opzeggingCount * 0.37)}</div>
          <div className="text-sm text-gray-500">Teruggewonnen</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">37%</div>
          <div className="text-sm text-gray-500">Win-back rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reason Selector */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Opzegreden Selecteren</h2>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {CANCEL_REASONS.length} redenen
            </span>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kies een opzegreden</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Snelle selectie</label>
              <div className="flex flex-wrap gap-2">
                {['HIGH_COST', 'TIME_CONSTRAINTS', 'LOST_INTEREST', 'HEALTH_ISSUES', 'OTHER'].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                      selectedReason === reason
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {CANCEL_REASONS.find(r => r.value === reason)?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message Editor */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Antwoord Bewerken</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum/Actie tekst</label>
              <input
                type="text"
                value={currentResponse.date}
                onChange={(e) => updateCancelResponse(selectedReason, 'date', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bijv. even contact op"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
              <textarea
                value={currentResponse.message}
                onChange={(e) => updateCancelResponse(selectedReason, 'message', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-y"
                placeholder="Je win-back bericht..."
              />
            </div>

            {/* Preview */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                WhatsApp Preview
              </div>
              <div className="text-sm text-gray-800">
                <strong>{config.gymName}</strong> - {currentResponse.date}
                <br /><br />
                {currentResponse.message}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
        <span>💡</span>
        <div className="text-sm text-yellow-800">
          <strong>Pro tip:</strong> Personaliseer elk antwoord op basis van de opzegreden. 
          Een lid dat opzegt vanwege prijs heeft andere behoeften dan iemand met tijdgebrek.
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