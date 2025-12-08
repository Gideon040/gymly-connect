'use client';

import { useState, useEffect } from 'react';

interface Template {
  type: string;
  date_text: string;
  message_text: string;
}

export default function InactiefPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gymName, setGymName] = useState('Potentia Gym');
  
  const [inactive30, setInactive30] = useState({ date: 'alweer 30 dagen', message: '' });
  const [inactive60, setInactive60] = useState({ date: 'al 60 dagen', message: '' });

  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const res = await fetch(`/api/templates?gym=${gymSlug}`);
      const data = await res.json();
      
      setGymName(data.gym?.name || 'Potentia Gym');
      
      data.templates?.forEach((t: Template) => {
        if (t.type === 'inactief_30') {
          setInactive30({ date: t.date_text, message: t.message_text });
        } else if (t.type === 'inactief_60') {
          setInactive60({ date: t.date_text, message: t.message_text });
        }
      });
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/templates?gym=${gymSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inactief_30',
          dateText: inactive30.date,
          messageText: inactive30.message,
        }),
      });

      await fetch(`/api/templates?gym=${gymSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inactief_60',
          dateText: inactive60.date,
          messageText: inactive60.message,
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inactieve Leden</h1>
        <p className="text-gray-500">Herinneringen voor leden die niet komen sporten</p>
      </div>

      {/* 30 dagen */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
          <h2 className="font-semibold text-purple-900">Na 30 dagen inactiviteit</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
            <input
              type="text"
              value={inactive30.date}
              onChange={(e) => setInactive30(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
            <textarea
              value={inactive30.message}
              onChange={(e) => setInactive30(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-sm text-gray-800">
              <span className="font-semibold">{gymName}</span> - {inactive30.date}
              <br /><br />
              {inactive30.message}
            </div>
          </div>
        </div>
      </div>

      {/* 60 dagen */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
          <h2 className="font-semibold text-red-900">Na 60 dagen inactiviteit</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
            <input
              type="text"
              value={inactive60.date}
              onChange={(e) => setInactive60(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
            <textarea
              value={inactive60.message}
              onChange={(e) => setInactive60(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="text-sm text-gray-800">
              <span className="font-semibold">{gymName}</span> - {inactive60.date}
              <br /><br />
              {inactive60.message}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Hoe werkt het?</strong> Elke dag om 08:00 checkt het systeem welke leden 
        30 of 60 dagen niet zijn geweest, en stuurt automatisch een herinnering.
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
          saved 
            ? 'bg-green-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        } disabled:opacity-50`}
      >
        {saving ? 'Opslaan...' : saved ? '✓ Opgeslagen!' : 'Opslaan'}
      </button>
    </div>
  );
}