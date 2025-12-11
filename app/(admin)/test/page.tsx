'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';

interface Gym {
  id: string;
  name: string;
  gymly_api_key: string | null;
  gymly_business_id: string | null;
  twilio_account_sid: string | null;
  twilio_auth_token: string | null;
  whatsapp_number: string | null;
  settings: { testPhone?: string };
}

interface InactiveMember {
  id: string;
  name: string;
  phone: string | null;
  lastCheckin: string | null;
  daysSinceCheckin: number | null;
}

export default function TestPage() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  
  // Inactieve leden state
  const [inactiveMembers, setInactiveMembers] = useState<{
    inactive30: InactiveMember[];
    inactive60: InactiveMember[];
    counts: { total: number; inactive30: number; inactive60: number };
  } | null>(null);
  
  // Custom dagen test state
  const [customDays, setCustomDays] = useState<number>(4);
  const [customInactive, setCustomInactive] = useState<{
    days: number;
    inactive: InactiveMember[];
    counts: { total: number; inactive: number };
  } | null>(null);

  useEffect(() => {
    loadGym();
  }, []);

  async function loadGym() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: gymData } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      setGym(gymData);
    } catch (error) {
      console.error('Error loading gym:', error);
    } finally {
      setLoading(false);
    }
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('nl-NL');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  // === GYMLY API TESTS ===

  const testGymlyConnection = async () => {
    if (!gym) return;
    setActionLoading('connection');
    
    try {
      const response = await fetch('/api/test/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId: gym.id, action: 'test_connection' }),
      });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        addLog(`✅ Gymly verbinding OK - ${data.memberCount} leden gevonden`);
      } else {
        addLog(`❌ Gymly fout: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
      setResult({ error: String(error) });
    } finally {
      setActionLoading(null);
    }
  };

  const fetchInactiveMembers = async () => {
    if (!gym) return;
    setActionLoading('inactive');
    
    try {
      const response = await fetch('/api/test/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId: gym.id, action: 'fetch_inactive' }),
      });
      const data = await response.json();
      
      if (data.success) {
        setInactiveMembers({
          inactive30: data.inactive30,
          inactive60: data.inactive60,
          counts: data.counts
        });
        addLog(`📊 ${data.counts.inactive30} leden 30+ dagen inactief, ${data.counts.inactive60} leden 60+ dagen`);
      } else {
        addLog(`❌ Fout: ${data.error}`);
      }
      setResult(data);
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  // === TEST: Custom dagen inactief ===
  const fetchInactiveCustom = async () => {
    if (!gym) return;
    setActionLoading('inactive_custom');
    
    try {
      const response = await fetch('/api/test/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gymId: gym.id, 
          action: 'fetch_inactive_custom',
          days: customDays 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomInactive({
          days: data.days,
          inactive: data.inactive,
          counts: data.counts
        });
        addLog(`🧪 TEST: ${data.counts.inactive} leden ${customDays}+ dagen inactief gevonden`);
      } else {
        addLog(`❌ Fout: ${data.error}`);
      }
      setResult(data);
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchBirthdays = async () => {
    if (!gym) return;
    setActionLoading('birthdays');
    
    try {
      const response = await fetch('/api/test/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId: gym.id, action: 'fetch_birthdays' }),
      });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        addLog(`🎂 ${data.count} leden jarig vandaag`);
      } else {
        addLog(`❌ Fout: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  // === WHATSAPP TESTS ===

  const sendTestMessage = async (type: string, phone?: string, name?: string) => {
    if (!gym) return;
    
    const testPhone = phone || gym.settings?.testPhone;
    if (!testPhone) {
      addLog('❌ Geen telefoonnummer opgegeven');
      setResult({ error: 'Geen telefoonnummer. Stel een test nummer in bij Instellingen.' });
      return;
    }

    setActionLoading(`send_${type}`);
    
    try {
      const response = await fetch('/api/test/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gymId: gym.id,
          type,
          phoneNumber: testPhone,
          recipientName: name || 'Test',
        }),
      });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        addLog(`✅ ${type} bericht verstuurd naar ${testPhone}`);
      } else {
        addLog(`❌ Versturen mislukt: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Setup status
  const hasGymlyCredentials = gym?.gymly_api_key && gym?.gymly_business_id;
  const hasTwilioCredentials = gym?.twilio_account_sid && gym?.twilio_auth_token && gym?.whatsapp_number;
  const hasTestPhone = gym?.settings?.testPhone;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Geen gym gevonden</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Console</h1>
        <p className="text-gray-500">Test de Gymly en WhatsApp integratie voor {gym.name}</p>
      </div>

      {/* Setup Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Setup Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${hasGymlyCredentials ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${hasGymlyCredentials ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">Gymly API</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {hasGymlyCredentials ? 'Credentials ingesteld' : 'API key of Business ID ontbreekt'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${hasTwilioCredentials ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${hasTwilioCredentials ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">Twilio WhatsApp</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {hasTwilioCredentials ? gym.whatsapp_number : 'Credentials ontbreken (admin)'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${hasTestPhone ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${hasTestPhone ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="font-medium">Test Nummer</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {hasTestPhone ? gym.settings.testPhone : 'Stel in bij Instellingen'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gymly API Tests */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🔗</span>
              Gymly API (ECHT)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Haalt echte data op van Gymly</p>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={testGymlyConnection}
              disabled={actionLoading !== null || !hasGymlyCredentials}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'connection' ? (
                <span className="animate-pulse">Verbinden...</span>
              ) : (
                <>
                  <span>🔌</span>
                  Test Gymly Verbinding
                </>
              )}
            </button>

            <button
              onClick={fetchInactiveMembers}
              disabled={actionLoading !== null || !hasGymlyCredentials}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'inactive' ? (
                <span className="animate-pulse">Ophalen...</span>
              ) : (
                <>
                  <span>⏰</span>
                  Haal Inactieve Leden Op (30/60 dagen)
                </>
              )}
            </button>

            <button
              onClick={fetchBirthdays}
              disabled={actionLoading !== null || !hasGymlyCredentials}
              className="w-full py-3 px-4 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'birthdays' ? (
                <span className="animate-pulse">Ophalen...</span>
              ) : (
                <>
                  <span>🎂</span>
                  Haal Verjaardagen Op
                </>
              )}
            </button>
          </div>
        </div>

        {/* TEST: Custom Dagen Inactief */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-yellow-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🧪</span>
              TEST: Custom Dagen Inactief
            </h2>
            <p className="text-sm text-gray-500 mt-1">Test met een lager aantal dagen</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aantal dagen inactief
              </label>
              <div className="flex gap-2">
                {[2, 4, 7, 14].map((d) => (
                  <button
                    key={d}
                    onClick={() => setCustomDays(d)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      customDays === d
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d} dagen
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={fetchInactiveCustom}
              disabled={actionLoading !== null || !hasGymlyCredentials}
              className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'inactive_custom' ? (
                <span className="animate-pulse">Ophalen...</span>
              ) : (
                <>
                  <span>🔍</span>
                  Zoek leden {customDays}+ dagen inactief
                </>
              )}
            </button>

            {/* Custom results */}
            {customInactive && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="font-semibold text-yellow-800 mb-2">
                  {customInactive.counts.inactive} leden {customInactive.days}+ dagen inactief
                </p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {customInactive.inactive.slice(0, 10).map((m) => (
                    <div key={m.id} className="text-sm bg-white rounded p-2 flex justify-between">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-gray-500">{m.daysSinceCheckin} dagen</span>
                    </div>
                  ))}
                  {customInactive.inactive.length > 10 && (
                    <p className="text-xs text-yellow-600">
                      + {customInactive.inactive.length - 10} meer...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Tests */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-green-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📱</span>
              WhatsApp Berichten (ECHT)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Stuurt echte berichten naar {gym.settings?.testPhone || 'geen nummer'}</p>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={() => sendTestMessage('proefles')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_proefles' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>👋</span>
                  Stuur Proefles Bericht
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('inactief_30')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_inactief_30' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>⏰</span>
                  Stuur Inactief 30d Bericht
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('inactief_60')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_inactief_60' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>🚨</span>
                  Stuur Inactief 60d Bericht
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('verjaardag')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_verjaardag' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>🎂</span>
                  Stuur Verjaardag Bericht
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📋</span>
              Activity Log
            </h2>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-900 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nog geen activiteit...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-green-400 mb-1">{log}</p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Laatste Resultaat (JSON)</h2>
          </div>
          <div className="p-4 bg-gray-900 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Inactieve leden results */}
      {inactiveMembers && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Inactieve Leden ({inactiveMembers.counts.total} totaal)
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 30 dagen */}
            <div>
              <h3 className="font-medium text-purple-600 mb-3">
                30+ dagen inactief ({inactiveMembers.counts.inactive30})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {inactiveMembers.inactive30.slice(0, 20).map((m) => (
                  <div key={m.id} className="bg-purple-50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-gray-500">{m.phone || 'Geen nummer'}</p>
                    <p className="text-purple-600">{m.daysSinceCheckin} dagen geleden</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 60 dagen */}
            <div>
              <h3 className="font-medium text-red-600 mb-3">
                60+ dagen inactief ({inactiveMembers.counts.inactive60})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {inactiveMembers.inactive60.slice(0, 20).map((m) => (
                  <div key={m.id} className="bg-red-50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-gray-500">{m.phone || 'Geen nummer'}</p>
                    <p className="text-red-600">{m.daysSinceCheckin} dagen geleden</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}