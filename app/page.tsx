'use client';

import { useState, useEffect } from 'react';

interface Config {
  // Template variabelen
  welcomeDate: string;
  welcomeMessage: string;
  // Gym info
  gymName: string;
  // Test nummer
  testPhone: string;
}

const defaultConfig: Config = {
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  gymName: 'Potentia Gym',
  testPhone: '+31624242177',
};

export default function AdminDashboard() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
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

  // Test webhook
  const testWebhook = async () => {
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
      setWebhookLogs(prev => [`[${new Date().toLocaleTimeString()}] Test webhook sent`, ...prev.slice(0, 9)]);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setTestLoading(false);
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
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏋️ Gym Instellingen
              </h2>
              <div className="space-y-4">
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
            </div>

            {/* WhatsApp Template */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💬 WhatsApp Bericht (Proefles Bevestiging)
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Sandbox template: &quot;Your appointment is coming up on <span className="text-blue-600">{'{datum}'}</span> at <span className="text-blue-600">{'{bericht}'}</span>&quot;
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum/Tijd tekst
                  </label>
                  <input
                    type="text"
                    value={config.welcomeDate}
                    onChange={(e) => setConfig({ ...config, welcomeDate: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Potentia Gym - we kijken ernaar uit!"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">📱 Preview:</p>
                <p className="text-sm text-green-700">
                  &quot;Your appointment is coming up on <strong>{config.welcomeDate}</strong> at <strong>{config.welcomeMessage}</strong>. If you need to change it, please reply back and let us know.&quot;
                </p>
              </div>
            </div>

            {/* Test Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🧪 Test Instellingen
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Telefoonnummer
                  </label>
                  <input
                    type="text"
                    value={config.testPhone}
                    onChange={(e) => setConfig({ ...config, testPhone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+31612345678"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let op: nummer moet &quot;join pilot-evening&quot; hebben gestuurd naar sandbox
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveConfig}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium transition flex items-center justify-center gap-2"
            >
              {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
            </button>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">⚡ Acties</h2>
              <div className="space-y-3">
                <button
                  onClick={testWebhook}
                  disabled={testLoading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition"
                >
                  {testLoading ? 'Versturen...' : '📱 Test WhatsApp Versturen'}
                </button>
                <a
                  href="/test"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  🔧 Uitgebreide Test Pagina
                </a>
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
              <p className="text-xs text-gray-500 mt-2">
                Gebruik deze URL in Gymly → Instellingen → Webhooks
              </p>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Twilio</span>
                  <span className="text-sm text-green-600 font-medium">✓ Verbonden</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gymly Webhook</span>
                  <span className="text-sm text-green-600 font-medium">✓ Actief</span>
                </div>
                <div className="flex justify-between items-center">
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