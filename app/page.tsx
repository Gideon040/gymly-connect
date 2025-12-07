'use client';

import { useState, useEffect } from 'react';

interface Config {
  // Proefles
  welcomeDate: string;
  welcomeMessage: string;
  // Opzegging
  cancelDate: string;
  cancelMessage: string;
  // Gym info
  gymName: string;
  // Test nummer
  testPhone: string;
}

const defaultConfig: Config = {
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  cancelDate: 'binnenkort',
  cancelMessage: 'We vinden het jammer dat je weggaat. Mogen we vragen waarom?',
  gymName: 'Potentia Gym',
  testPhone: '+31624242177',
};

export default function AdminDashboard() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('gymly-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Save config
  const saveConfig = () => {
    localStorage.setItem('gymly-config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Test proefles webhook
  const testProefles = async () => {
    setTestLoading(true);
    setTestResult(null);

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
              lastName: 'Gebruiker',
              phoneNumber: config.testPhone,
              email: 'test@example.com',
            },
            business: { id: 'test-123', name: config.gymName },
          },
        }),
      });

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
      setWebhookLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ Proefles WhatsApp → ${config.testPhone}`, 
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setTestLoading(false);
    }
  };

  // Test opzegging webhook
  const testOpzegging = async () => {
    setCancelLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'BusinessMembershipCancelled',
          businessId: 'test-123',
          data: {
            user: {
              id: `user-${Date.now()}`,
              firstName: 'Test',
              lastName: 'Gebruiker',
              phoneNumber: config.testPhone,
              email: 'test@example.com',
            },
            business: { id: 'test-123', name: config.gymName },
            membership: { id: 'mem-123', name: 'Basis Abonnement' },
          },
        }),
      });

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
      setWebhookLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 👋 Opzegging WhatsApp → ${config.testPhone}`, 
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GymlyConnect</h1>
              <p className="text-sm text-gray-500">WhatsApp Automation Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Verbonden
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Config Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gym Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">🏋️ Gym Instellingen</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gym Naam
                </label>
                <input
                  type="text"
                  value={config.gymName}
                  onChange={(e) => setConfig({ ...config, gymName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Proefles Template */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">💬 Proefles Bevestiging</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum tekst
                  </label>
                  <input
                    type="text"
                    value={config.welcomeDate}
                    onChange={(e) => setConfig({ ...config, welcomeDate: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="deze week"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Welkomst bericht
                  </label>
                  <input
                    type="text"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-1">📱 Preview:</p>
                <p className="text-sm text-green-700">
                  &quot;Your appointment is coming up on <strong>{config.welcomeDate}</strong> at <strong>{config.welcomeMessage}</strong>.&quot;
                </p>
              </div>
            </div>

            {/* Opzegging Template */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">👋 Opzegging Bericht</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum tekst
                  </label>
                  <input
                    type="text"
                    value={config.cancelDate}
                    onChange={(e) => setConfig({ ...config, cancelDate: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="binnenkort"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opzegging bericht
                  </label>
                  <input
                    type="text"
                    value={config.cancelMessage}
                    onChange={(e) => setConfig({ ...config, cancelMessage: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-800 mb-1">📱 Preview:</p>
                <p className="text-sm text-orange-700">
                  &quot;Your appointment is coming up on <strong>{config.cancelDate}</strong> at <strong>{config.cancelMessage}</strong>.&quot;
                </p>
              </div>
            </div>

            {/* Test Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">🧪 Test Instellingen</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Telefoonnummer
                </label>
                <input
                  type="text"
                  value={config.testPhone}
                  onChange={(e) => setConfig({ ...config, testPhone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="+31612345678"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Moet &quot;join pilot-evening&quot; hebben gestuurd naar sandbox
                </p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveConfig}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
            >
              {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
            </button>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">⚡ Test Acties</h2>
              <div className="space-y-3">
                <button
                  onClick={testProefles}
                  disabled={testLoading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {testLoading ? 'Versturen...' : '📱 Test Proefles'}
                </button>
                <button
                  onClick={testOpzegging}
                  disabled={cancelLoading}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {cancelLoading ? 'Versturen...' : '👋 Test Opzegging'}
                </button>
              </div>

              {testResult && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Resultaat:</p>
                  <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-auto max-h-40">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>

            {/* Webhook Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">🔗 Webhook URL</h2>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-xs break-all text-gray-700">
                  https://gymly-connect.vercel.app/api/webhooks/gymly
                </code>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Twilio</span>
                  <span className="text-sm text-green-600 font-medium">✓ Verbonden</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gymly Webhook</span>
                  <span className="text-sm text-green-600 font-medium">✓ Actief</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode</span>
                  <span className="text-sm text-yellow-600 font-medium">Sandbox</span>
                </div>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">📝 Recente Logs</h2>
              {webhookLogs.length === 0 ? (
                <p className="text-sm text-gray-500">Nog geen activiteit</p>
              ) : (
                <div className="space-y-2">
                  {webhookLogs.map((log, i) => (
                    <p key={i} className="text-xs text-gray-600 font-mono">{log}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}