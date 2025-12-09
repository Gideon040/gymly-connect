'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../components/AuthProvider';

interface InactiveMember {
  id: string;
  name: string;
  phone: string | null;
  lastCheckin: string | null;
  daysSinceCheckin: number | null;
}

export default function TestPage() {
  const { user } = useAuth();
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Data states
  const [inactiveMembers, setInactiveMembers] = useState<{
    inactive30: InactiveMember[];
    inactive60: InactiveMember[];
    counts: { total: number; inactive30: number; inactive60: number };
  } | null>(null);

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

      if (data) setGym(data);
      setLoading(false);
    }
    loadGym();
  }, [user]);

  const addLog = (message: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${message}`, ...prev.slice(0, 19)]);
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
        addLog(`✅ Gymly verbonden! ${data.memberCount} leden gevonden`);
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
                  Haal Inactieve Leden Op
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
                  <span>✅</span>
                  Stuur Proefles Bevestiging
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('inactief_30')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_inactief_30' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>⏰</span>
                  Stuur Inactief 30 Dagen
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('inactief_60')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_inactief_60' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>🚨</span>
                  Stuur Inactief 60 Dagen
                </>
              )}
            </button>

            <button
              onClick={() => sendTestMessage('verjaardag')}
              disabled={actionLoading !== null || !hasTwilioCredentials || !hasTestPhone}
              className="w-full py-3 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'send_verjaardag' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>🎂</span>
                  Stuur Verjaardag
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inactive Members List */}
      {inactiveMembers && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Inactieve Leden ({inactiveMembers.counts.inactive30} van {inactiveMembers.counts.total})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-2">30+ dagen inactief ({inactiveMembers.inactive30.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {inactiveMembers.inactive30.slice(0, 10).map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{member.phone || 'geen nummer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{member.daysSinceCheckin} dagen</span>
                        {member.phone && hasTwilioCredentials && (
                          <button
                            onClick={() => sendTestMessage('inactief_30', member.phone!, member.name)}
                            disabled={actionLoading !== null}
                            className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                          >
                            Stuur
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {inactiveMembers.inactive30.length > 10 && (
                    <p className="text-sm text-gray-500">En {inactiveMembers.inactive30.length - 10} meer...</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-red-600 mb-2">60+ dagen inactief ({inactiveMembers.inactive60.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {inactiveMembers.inactive60.slice(0, 10).map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{member.phone || 'geen nummer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{member.daysSinceCheckin} dagen</span>
                        {member.phone && hasTwilioCredentials && (
                          <button
                            onClick={() => sendTestMessage('inactief_60', member.phone!, member.name)}
                            disabled={actionLoading !== null}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            Stuur
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {inactiveMembers.inactive60.length > 10 && (
                    <p className="text-sm text-gray-500">En {inactiveMembers.inactive60.length - 10} meer...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>📋</span>
            Activiteit Log
          </h2>
          {logs.length > 0 && (
            <button onClick={() => setLogs([])} className="text-sm text-gray-400 hover:text-gray-600">
              Wissen
            </button>
          )}
        </div>
        <div className="p-6">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <span className="text-3xl block mb-2">📭</span>
              <p>Nog geen activiteit</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm py-2 px-3 bg-gray-50 rounded-lg text-gray-600">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Response */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📊</span>
              API Response
            </h2>
            <button onClick={() => setResult(null)} className="text-sm text-gray-400 hover:text-gray-600">
              Sluiten
            </button>
          </div>
          <div className="p-6">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Sandbox Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-medium text-yellow-800">WhatsApp Sandbox</p>
          <p className="text-sm text-yellow-700 mt-1">
            Bij sandbox modus moet het ontvangende nummer eerst de join-code sturen naar {gym.whatsapp_number || 'je Twilio nummer'}.
            Check je Twilio console voor de specifieke join-code.
          </p>
        </div>
      </div>
    </div>
  );
}