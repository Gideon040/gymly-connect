'use client';

import { useState } from 'react';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'webhook'>('whatsapp');
  
  // WhatsApp test state
  const [phoneNumber, setPhoneNumber] = useState('+31624242177');
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappResult, setWhatsappResult] = useState<string | null>(null);

  // Webhook test state
  const [leadFirstName, setLeadFirstName] = useState('Gideon');
  const [leadLastName, setLeadLastName] = useState('Test');
  const [leadPhone, setLeadPhone] = useState('+31624242177');
  const [leadEmail, setLeadEmail] = useState('test@example.com');
  const [eventType, setEventType] = useState('BusinessLeadCreated');
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookResult, setWebhookResult] = useState<string | null>(null);

  // Direct WhatsApp test
  const sendWhatsAppTest = async () => {
    setWhatsappLoading(true);
    setWhatsappResult(null);
    
    try {
      const response = await fetch('/api/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      setWhatsappResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setWhatsappResult(`Error: ${error}`);
    } finally {
      setWhatsappLoading(false);
    }
  };

  // Simulate Gymly webhook
  const simulateWebhook = async () => {
    setWebhookLoading(true);
    setWebhookResult(null);

    const payload = {
      id: `webhook-${Date.now()}`,
      eventType,
      category: 'LEADS',
      timestamp: new Date().toISOString(),
      businessId: 'test-gym-123',
      data: {
        lead: {
          id: `lead-${Date.now()}`,
          firstName: leadFirstName,
          lastName: leadLastName,
          phoneNumber: leadPhone,
          email: leadEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        business: {
          id: 'test-gym-123',
          name: 'Potentia Gym',
        },
        location: null,
        membership: {
          id: 'membership-1',
          name: 'Proefles',
        },
      },
    };

    try {
      const response = await fetch('/api/webhooks/gymly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      setWebhookResult(JSON.stringify({ request: payload, response: data }, null, 2));
    } catch (error) {
      setWebhookResult(`Error: ${error}`);
    } finally {
      setWebhookLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">GymlyConnect Test Dashboard</h1>
        <p className="text-gray-600 mb-6">Test WhatsApp integratie en webhook handling</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'whatsapp'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📱 WhatsApp Direct
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'webhook'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🔗 Gymly Webhook
          </button>
        </div>

        {/* WhatsApp Direct Test */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Direct WhatsApp Test</h2>
            <p className="text-gray-600 text-sm mb-4">
              Verstuur direct een test bericht naar WhatsApp (sandbox template)
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefoonnummer
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="+31612345678"
                />
              </div>
              
              <button
                onClick={sendWhatsAppTest}
                disabled={whatsappLoading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {whatsappLoading ? 'Versturen...' : '📱 Verstuur Test Bericht'}
              </button>
              
              {whatsappResult && (
                <div>
                  <label className="block text-sm font-medium mb-1">Response</label>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                    {whatsappResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Webhook Simulator */}
        {activeTab === 'webhook' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gymly Webhook Simulator</h2>
            <p className="text-gray-600 text-sm mb-4">
              Simuleer een Gymly webhook event (zoals wanneer iemand een proefles boekt)
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="BusinessLeadCreated">BusinessLeadCreated (Nieuwe proefles)</option>
                  <option value="BusinessLeadCancelled">BusinessLeadCancelled (Proefles geannuleerd)</option>
                  <option value="BusinessLeadDone">BusinessLeadDone (Lead → Lid)</option>
                  <option value="BusinessMembershipCancelled">BusinessMembershipCancelled (Opzegging)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Voornaam</label>
                  <input
                    type="text"
                    value={leadFirstName}
                    onChange={(e) => setLeadFirstName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Achternaam</label>
                  <input
                    type="text"
                    value={leadLastName}
                    onChange={(e) => setLeadLastName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefoonnummer</label>
                <input
                  type="text"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="+31612345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="email@example.com"
                />
              </div>
              
              <button
                onClick={simulateWebhook}
                disabled={webhookLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {webhookLoading ? 'Verwerken...' : '🔗 Simuleer Webhook'}
              </button>
              
              {webhookResult && (
                <div>
                  <label className="block text-sm font-medium mb-1">Request & Response</label>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {webhookResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Sandbox Mode</h3>
          <p className="text-sm text-yellow-700">
            Je gebruikt nu de Twilio sandbox. Berichten werken alleen naar nummers die 
            &quot;join pilot-evening&quot; hebben gestuurd naar +1 415 523 8886.
          </p>
        </div>
      </div>
    </div>
  );
}