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
  const { config, updateCancelResponse, saveConfig, saved } = useConfig();
  const [selectedReason, setSelectedReason] = useState('HIGH_COST');

  const currentResponse = config.cancelResponses[selectedReason] || { date: '', message: '' };

  // Group by category
  const groupedReasons = CANCEL_REASONS.reduce((acc, reason) => {
    if (!acc[reason.category]) acc[reason.category] = [];
    acc[reason.category].push(reason);
    return acc;
  }, {} as Record<string, typeof CANCEL_REASONS>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card orange">
          <div className="stat-value">8</div>
          <div className="stat-label">Opzeggingen deze maand</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">3</div>
          <div className="stat-label">Teruggewonnen</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">37%</div>
          <div className="stat-label">Win-back rate</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Reason Selector */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span>📋</span>
              Opzegreden Selecteren
            </h2>
            <span className="status-badge pending">{CANCEL_REASONS.length} redenen</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Kies een opzegreden</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="form-input form-select"
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

            {/* Quick Select Grid */}
            <div className="mt-4">
              <label className="form-label">Snelle selectie</label>
              <div className="flex flex-wrap gap-2 mt-2">
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span>✏️</span>
              Antwoord Bewerken
            </h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Datum/Actie tekst</label>
              <input
                type="text"
                value={currentResponse.date}
                onChange={(e) => updateCancelResponse(selectedReason, 'date', e.target.value)}
                className="form-input"
                placeholder="Bijv. even contact op"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bericht</label>
              <textarea
                value={currentResponse.message}
                onChange={(e) => updateCancelResponse(selectedReason, 'message', e.target.value)}
                className="form-input form-textarea"
                placeholder="Je win-back bericht..."
              />
            </div>

            {/* Preview */}
            <div className="message-preview orange">
              <div className="message-preview-text">
                <strong>{config.gymName}</strong> - {currentResponse.date}
                <br /><br />
                {currentResponse.message}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-warning">
        <span>💡</span>
        <div>
          <strong>Pro tip:</strong> Personaliseer elk antwoord op basis van de opzegreden. 
          Een lid dat opzegt vanwege prijs heeft andere behoeften dan iemand met tijdgebrek.
        </div>
      </div>

      {/* Save */}
      <button
        onClick={saveConfig}
        className={`btn btn-lg btn-block ${saved ? 'btn-success' : 'btn-primary'}`}
      >
        {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
      </button>

      {saved && (
        <div className="toast">
          <span>✓</span>
          Wijzigingen opgeslagen
        </div>
      )}
    </div>
  );
}