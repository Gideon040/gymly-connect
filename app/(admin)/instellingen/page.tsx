'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../components/AuthProvider';

export default function InstellingenPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Gym data
  const [gym, setGym] = useState<any>(null);
  const [gymName, setGymName] = useState('');
  const [gymEmail, setGymEmail] = useState('');
  const [gymlyApiKey, setGymlyApiKey] = useState('');
  const [gymlyBusinessId, setGymlyBusinessId] = useState('');
  const [testPhone, setTestPhone] = useState('');

  // Load gym data
  useEffect(() => {
    async function loadGym() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) {
        setGym(data);
        setGymName(data.name || '');
        setGymEmail(data.email || '');
        setGymlyApiKey(data.gymly_api_key || '');
        setGymlyBusinessId(data.gymly_business_id || '');
        setTestPhone(data.settings?.testPhone || '');
      }
      setLoading(false);
    }

    loadGym();
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    
    if (!gym) {
      setError('Geen gym gevonden');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');

    const slug = gymName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { error: updateError } = await supabase
      .from('gyms')
      .update({
        name: gymName,
        slug: slug,
        email: gymEmail,
        gymly_api_key: gymlyApiKey || null,
        gymly_business_id: gymlyBusinessId || null,
        settings: { ...(gym.settings || {}), testPhone: testPhone || null },
        status: gymlyApiKey ? 'active' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', gym.id);

    if (updateError) {
      setError('Opslaan mislukt: ' + updateError.message);
    } else {
      setSuccess('Instellingen opgeslagen!');
      // Refresh data
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gym.id)
        .single();
      if (data) setGym(data);
    }

    setSaving(false);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  // No gym found
  if (!gym) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Geen gym gevonden voor dit account.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-500">Beheer je gym gegevens en koppelingen</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Error/Success */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Gym Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Gym Informatie</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gym Naam</label>
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={gymEmail}
                onChange={(e) => setGymEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Telefoonnummer</label>
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+31612345678"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Dit nummer ontvangt testberichten</p>
            </div>
          </div>
        </div>

        {/* Gymly */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Gymly Koppeling</h2>
            {gym.gymly_api_key ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Verbonden
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                Niet verbonden
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
              <input
                type="text"
                value={gymlyApiKey}
                onChange={(e) => setGymlyApiKey(e.target.value)}
                placeholder="gymly_api_..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business ID</label>
              <input
                type="text"
                value={gymlyBusinessId}
                onChange={(e) => setGymlyBusinessId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp - Read only */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">WhatsApp</h2>
            {gym.whatsapp_number ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Verbonden
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-yellow-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Wacht op setup
              </span>
            )}
          </div>
          {gym.whatsapp_number ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">{gym.whatsapp_number}</div>
                <div className="text-sm text-gray-500">Twilio WhatsApp nummer</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              WhatsApp wordt geconfigureerd door het GymlyConnect team. 
              Neem contact op via <a href="mailto:info@gymlyconnect.nl" className="text-purple-600 hover:underline">info@gymlyconnect.nl</a>
            </div>
          )}
        </div>

        {/* Account Info - Read only */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Account email</span>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Gym ID</span>
              <span className="text-gray-900 font-mono text-xs">{gym.id}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Status</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                gym.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : gym.status === 'onboarding'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {gym.status}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-all"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}