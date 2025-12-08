'use client';

import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import ConfigCard from '../../components/ConfigCard';
import TestResult from '../../components/TestResult';

export default function TestPage() {
  const { config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const testProefles = async () => {
    setLoading(true);
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
      setResult(JSON.stringify(data, null, 2));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Proefles → ${config.testPhone}`, ...prev.slice(0, 9)]);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testOpzegging = async (reason: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessMembershipCancelled',
          businessId: 'test-123',
          data: {
            user: { id: `user-${Date.now()}`, firstName: 'Test', phoneNumber: config.testPhone },
            cancellationReason: reason,
          },
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 👋 Opzegging (${reason}) → ${config.testPhone}`, ...prev.slice(0, 9)]);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testInactief = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/inactive-members');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 😴 Inactieve leden check`, ...prev.slice(0, 9)]);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ConfigCard title="🧪 Test Acties">
        <div className="space-y-4">
          <button
            onClick={testProefles}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Versturen...' : '📱 Test Proefles'}
          </button>
          
          <button
            onClick={() => testOpzegging('HIGH_COST')}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Versturen...' : '👋 Test Opzegging (Te duur)'}
          </button>
          
          <button
            onClick={testInactief}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Controleren...' : '😴 Test Inactieve Leden Check'}
          </button>
        </div>
      </ConfigCard>

      <ConfigCard title="📊 Resultaten">
        <TestResult result={result} logs={logs} />
      </ConfigCard>
    </div>
  );
}