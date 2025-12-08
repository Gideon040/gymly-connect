'use client';

import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';

export default function TestPage() {
  const { config } = useConfig();
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const testProefles = async () => {
    setLoading('proefles');
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessLeadCreated',
          businessId: 'test-123',
          data: {
            lead: {
              id: `lead-${Date.now()}`,
              firstName: 'Test',
              phoneNumber: config.testPhone,
            },
          },
        }),
      });
      const data = await response.json();
      setResult(data);
      setLogs(prev => [`${new Date().toLocaleTimeString()} - ✅ Proefles test verstuurd naar ${config.testPhone}`, ...prev.slice(0, 9)]);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  const testOpzegging = async () => {
    setLoading('opzegging');
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessMembershipCancelled',
          businessId: 'test-123',
          data: {
            user: { id: `user-${Date.now()}`, firstName: 'Test', phoneNumber: config.testPhone },
            cancellationReason: 'HIGH_COST',
          },
        }),
      });
      const data = await response.json();
      setResult(data);
      setLogs(prev => [`${new Date().toLocaleTimeString()} - 👋 Opzegging test (HIGH_COST) verstuurd`, ...prev.slice(0, 9)]);
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

  return (
    <div className="space-y-6">
      {/* Test Phone Info */}
      <div className="alert alert-info">
        <span>📱</span>
        <div>
          Test berichten worden verstuurd naar <strong>{config.testPhone}</strong>. 
          Pas dit aan in de Proefles instellingen.
        </div>
      </div>

      <div className="grid-2">
        {/* Test Buttons */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span>🧪</span>
              Test Webhooks
            </h2>
          </div>
          <div className="card-body space-y-4">
            <button
              onClick={testProefles}
              disabled={loading !== null}
              className="btn btn-success btn-block btn-lg"
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
              onClick={testOpzegging}
              disabled={loading !== null}
              className="btn btn-warning btn-block btn-lg"
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
              onClick={testDailyCron}
              disabled={loading !== null}
              className="btn btn-secondary btn-block btn-lg"
              style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
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
          <div className="card-body">
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
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
          <div className="card-body">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Sandbox Warning */}
      <div className="alert alert-warning">
        <span>⚠️</span>
        <div>
          <strong>Sandbox Mode:</strong> Berichten worden alleen ontvangen als het nummer 
          "join pilot-evening" heeft gestuurd naar de Twilio WhatsApp sandbox.
        </div>
      </div>
    </div>
  );
}