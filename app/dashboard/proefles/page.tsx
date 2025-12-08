'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  date_text: string;
  message_text: string;
}

export default function ProeflesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dateText, setDateText] = useState('deze week');
  const [messageText, setMessageText] = useState('');
  const [gymName, setGymName] = useState('Potentia Gym');

  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadTemplate();
  }, []);

  async function loadTemplate() {
    try {
      const res = await fetch(`/api/templates?gym=${gymSlug}`);
      const data = await res.json();
      
      setGymName(data.gym?.name || 'Potentia Gym');
      
      const template = data.templates?.find((t: Template & { type: string }) => t.type === 'proefles');
      if (template) {
        setDateText(template.date_text);
        setMessageText(template.message_text);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/templates?gym=${gymSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'proefles',
          dateText,
          messageText,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proefles</h1>
        <p className="text-gray-500">Automatische bevestiging voor nieuwe leads</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum tekst</label>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="bijv. deze week, morgen, vrijdag"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bericht</label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Je welkomstbericht..."
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{gymName}</span> - {dateText}
                <br /><br />
                {messageText}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Hoe werkt het?</strong> Wanneer een nieuwe lead zich aanmeldt via Gymly, 
        ontvangt deze automatisch een WhatsApp bevestiging met bovenstaande tekst.
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