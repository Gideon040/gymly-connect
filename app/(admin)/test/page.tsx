'use client';

import { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../components/AuthProvider';

export default function TestPage() {
  const { user } = useAuth();
  const { config } = useConfig();
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Load gym data
  useEffect(() => {
    async function loadGym() {
      if (!user) return;
      
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) setGym(data);
    }
    loadGym();
  }, [user]);

  const testPhone = gym?.settings?.testPhone || config.testPhone;
  const businessId = gym?.gymly_business_id;

  const testProefles = async () => {
    if (!businessId) {
      setResult({ error: 'Geen Gymly Business ID ingesteld. Ga naar Instellingen.' });
      return;
    }
    if (!testPhone) {
      setResult({ error: 'Geen test telefoonnummer ingesteld. Ga naar Instellingen.' });
      return;
    }

    setLoading('proefles');
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessLeadCreated',
          businessId: businessId,
          data: {
            lead: {
              id: `lead-${Date.now()}`,
              firstName: 'Test',
              phoneNumber: testPhone,
            },
          },
        }),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ✅ Proefles test verstuurd naar ${testPhone}`, ...prev.slice(0, 9)]);
      } else {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ❌ Fout: ${data.error || 'Onbekend'}`, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      setResult({ error: String(error) });
      setLogs(prev => [`${new Date().toLocaleTimeString()} - ❌ Fout: ${error}`, ...prev.slice(0, 9)]);
    } finally {
      setLoading(null);
    }
  };

  const testOpzegging = async (reason: string = 'HIGH_COST') => {
    if (!businessId) {
      setResult({ error: 'Geen Gymly Business ID ingesteld. Ga naar Instellingen.' });
      return;
    }
    if (!testPhone) {
      setResult({ error: 'Geen test telefoonnummer ingesteld. Ga naar Instellingen.' });
      return;
    }

    setLoading('opzegging');
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessMembershipCancelled',
          businessId: businessId,
          data: {
            user: { 
              id: `user-${Date.now()}`, 
              firstName: 'Test', 
              phoneNumber: testPhone 
            },
            cancellationReason: reason,
          },
        }),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - 👋 Opzegging test (${reason}) verstuurd`, ...prev.slice(0, 9)]);
      } else {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ❌ Fout: ${data.error || 'Onbekend'}`, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  const testInactief = async (days: number = 30) => {
    if (!businessId) {
      setResult({ error: 'Geen Gymly Business ID ingesteld. Ga naar Instellingen.' });
      return;
    }
    if (!testPhone) {
      setResult({ error: 'Geen test telefoonnummer ingesteld. Ga naar Instellingen.' });
      return;
    }

    setLoading('inactief');
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessMemberInactive',
          businessId: businessId,
          data: {
            user: { 
              id: `user-${Date.now()}`, 
              firstName: 'Test', 
              phoneNumber: testPhone 
            },
            inactiveDays: days,
          },
        }),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ⏰ Inactief ${days} dagen test verstuurd`, ...prev.slice(0, 9)]);
      } else {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ❌ Fout: ${data.error || 'Onbekend'}`, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  const testDailyCron = async () => {
    setLoading('cron');
    try {
      const response = await fetch('/api/cron/daily');
      const data = await response.json();
      setResult(data);
      setLogs(prev => [`${new Date().toLocaleTimeString()} - 🔄 Daily cron uitgevoerd`, ...prev.slice(0, 9)]);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  // Check setup status
  const isSetupComplete = businessId && testPhone && gym?.twilio_account_sid;

  return (
    <div className="space-y-6">
      {/* Setup Status */}
      {!isSetupComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Setup onvolledig</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {!businessId && <li>• Gymly Business ID niet ingesteld</li>}
            {!testPhone && <li>• Test telefoonnummer niet ingesteld</li>}
            {!gym?.twilio_account_sid && <li>• Twilio credentials niet ingesteld (admin)</li>}
          </ul>
        </div>
      )}

      {/* Test Phone Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">📱</span>
        <div>
          <p className="text-blue-800">
            Test berichten worden verstuurd naar <strong>{testPhone || 'niet ingesteld'}</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Gym: {gym?.name || 'Laden...'} • Business ID: {businessId ? `${businessId.slice(0, 8)}...` : 'niet ingesteld'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Buttons */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🧪</span>
              Test Webhooks
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={testProefles}
              disabled={loading !== null || !isSetupComplete}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading === 'proefles' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>📱</span>
                  Test Proefles Bevestiging
                </>
              )}
            </button>

            <button
              onClick={() => testOpzegging('HIGH_COST')}
              disabled={loading !== null || !isSetupComplete}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading === 'opzegging' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>👋</span>
                  Test Opzegging (Te Duur)
                </>
              )}
            </button>

            <button
              onClick={() => testInactief(30)}
              disabled={loading !== null || !isSetupComplete}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading === 'inactief' ? (
                <span className="animate-pulse">Versturen...</span>
              ) : (
                <>
                  <span>⏰</span>
                  Test Inactief (30 dagen)
                </>
              )}
            </button>

            <button
              onClick={testDailyCron}
              disabled={loading !== null}
              className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading === 'cron' ? (
                <span className="animate-pulse">Controleren...</span>
              ) : (
                <>
                  <span>🔄</span>
                  Test Daily Cron
                </>
              )}
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📋</span>
              Activiteit Log
            </h2>
            {logs.length > 0 && (
              <button 
                onClick={() => setLogs([])}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Wissen
              </button>
            )}
          </div>
          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-3xl block mb-2">📭</span>
                <p>Nog geen activiteit</p>
                <p className="text-sm">Klik op een test button om te beginnen</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div 
                    key={index}
                    className="text-sm py-2 px-3 bg-gray-50 rounded-lg text-gray-600"
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📊</span>
              API Response
            </h2>
            <button 
              onClick={() => setResult(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Sluiten
            </button>
          </div>
          <div className="p-6">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Sandbox Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-medium text-yellow-800">Sandbox Mode</p>
          <p className="text-sm text-yellow-700 mt-1">
            Berichten worden alleen ontvangen als het nummer eerst een join-code heeft gestuurd naar de Twilio WhatsApp sandbox. 
            Check je Twilio console voor de specifieke join-code.
          </p>
        </div>
      </div>
    </div>
  );
}