'use client';

import { useState, useEffect } from 'react';

const CANCEL_REASONS = [
  { value: 'HIGH_COST', label: 'Te duur' },
  { value: 'FOUND_CHEAPER_ALTERNATIVE', label: 'Goedkoper alternatief gevonden' },
  { value: 'FINANCIAL_HARDSHIP', label: 'Financiële problemen' },
  { value: 'LACK_OF_PROGRESS', label: 'Geen vooruitgang' },
  { value: 'LOST_INTEREST', label: 'Interesse verloren' },
  { value: 'TIME_CONSTRAINTS', label: 'Geen tijd' },
  { value: 'LOCATION_CHANGE', label: 'Verhuizing' },
  { value: 'HEALTH_ISSUES', label: 'Gezondheidsproblemen' },
  { value: 'OTHER', label: 'Anders' },
];

interface Template {
  type: string;
  trigger_key: string | null;
  date_text: string;
  message_text: string;
}

export default function OpzeggingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedReason, setSelectedReason] = useState('HIGH_COST');
  const [templates, setTemplates] = useState<Record<string, { date: string; message: string }>>({});
  const [gymName, setGymName] = useState('Potentia Gym');

  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const res = await fetch(`/api/templates?gym=${gymSlug}`);
      const data = await res.json();
      
      setGymName(data.gym?.name || 'Potentia Gym');
      
      const opzeggingTemplates: Record<string, { date: string; message: string }> = {};
      data.templates?.forEach((t: Template) => {
        if (t.type === 'opzegging' && t.trigger_key) {
          opzeggingTemplates[t.trigger_key] = {
            date: t.date_text,
            message: t.message_text,
          };
        }
      });
      setTemplates(opzeggingTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  }

  function updateTemplate(reason: string, field: 'date' | 'message', value: string) {
    setTemplates(prev => ({
      ...prev,
      [reason]: {
        ...prev[reason],
        [field]: value,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const current = templates[selectedReason];
      if (!current) return;

      const res = await fetch(`/api/templates?gym=${gymSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'opzegging',
          triggerKey: selectedReason,
          dateText: current.date,
          messageText: current.message,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  const currentTemplate = templates[selectedReason] || { date: '', message: '' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Opzegging</h1>
        <p className="text-gray-500">Win-back berichten per opzegreden</p>
      </div>

      {/* Reason Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Selecteer opzegreden</label>
        <div className="grid grid-cols-3 gap-2">
          {CANCEL_REASONS.map((reason) => (
            <button
              key={reason.value}
              onClick={() => setSelectedReason(reason.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedReason === reason.value
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {reason.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">
            Bericht voor: {CANCEL_REASONS.find(r => r.value === selectedReason)?.label}
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
            <input
              type="text"
              value={currentTemplate.date}
              onChange={(e) => updateTemplate(selectedReason, 'date', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="bijv. even contact op, binnenkort"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
            <textarea
              value={currentTemplate.message}
              onChange={(e) => updateTemplate(selectedReason, 'message', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Je win-back bericht..."
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{gymName}</span> - {currentTemplate.date}
                <br /><br />
                {currentTemplate.message}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
          saved 
            ? 'bg-green-600' 
            : 'bg-orange-600 hover:bg-orange-700'
        } disabled:opacity-50`}
      >
        {saving ? 'Opslaan...' : saved ? '✓ Opgeslagen!' : 'Opslaan'}
      </button>
    </div>
  );
}