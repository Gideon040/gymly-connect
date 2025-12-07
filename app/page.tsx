'use client';

import { useState, useEffect } from 'react';

// Alle cancellation reasons
const CANCELLATION_REASONS = [
  { value: 'HIGH_COST', label: '💰 Te duur', category: 'Kosten' },
  { value: 'FOUND_CHEAPER_ALTERNATIVE', label: '💸 Goedkoper gevonden', category: 'Kosten' },
  { value: 'FINANCIAL_HARDSHIP', label: '📉 Financiële problemen', category: 'Kosten' },
  { value: 'LACK_OF_PROGRESS', label: '📊 Geen vooruitgang', category: 'Motivatie' },
  { value: 'SLOW_RESULTS', label: '🐢 Langzame resultaten', category: 'Motivatie' },
  { value: 'LOST_INTEREST', label: '😴 Interesse verloren', category: 'Motivatie' },
  { value: 'FEELING_OVERWHELMED', label: '😰 Overweldigd', category: 'Motivatie' },
  { value: 'TIME_CONSTRAINTS', label: '⏰ Geen tijd', category: 'Tijd/Locatie' },
  { value: 'INCONVENIENT_HOURS', label: '🕐 Onhandige tijden', category: 'Tijd/Locatie' },
  { value: 'LOCATION_CHANGE', label: '🏠 Verhuisd', category: 'Tijd/Locatie' },
  { value: 'COMMUTING_DIFFICULTY', label: '🚗 Reistijd', category: 'Tijd/Locatie' },
  { value: 'LACK_OF_COMMUNITY', label: '👥 Geen community', category: 'Sociaal' },
  { value: 'FRIENDS_LEFT', label: '👋 Vrienden weg', category: 'Sociaal' },
  { value: 'UNWELCOMING_ENVIRONMENT', label: '😕 Onwelkom gevoel', category: 'Sociaal' },
  { value: 'POOR_COMMUNICATION', label: '📵 Slechte communicatie', category: 'Service' },
  { value: 'LACK_OF_ATTENTION', label: '👀 Te weinig aandacht', category: 'Service' },
  { value: 'GENERAL_DISSATISFACTION', label: '👎 Algemeen ontevreden', category: 'Service' },
  { value: 'EQUIPMENT_ISSUES', label: '🏋️ Apparatuur problemen', category: 'Service' },
  { value: 'CLEANLINESS_CONCERNS', label: '🧹 Hygiëne zorgen', category: 'Service' },
  { value: 'HEALTH_ISSUES', label: '🏥 Gezondheidsproblemen', category: 'Persoonlijk' },
  { value: 'MAJOR_LIFE_CHANGE', label: '🔄 Grote verandering', category: 'Persoonlijk' },
  { value: 'TRAVEL_FREQUENCY', label: '✈️ Veel op reis', category: 'Persoonlijk' },
  { value: 'SELF_SUFFICIENT', label: '💪 Zelfstandig verder', category: 'Overig' },
  { value: 'SEASONAL_MEMBER', label: '🌞 Seizoenslid', category: 'Overig' },
  { value: 'BETTER_ALTERNATIVE', label: '🔀 Beter alternatief', category: 'Overig' },
  { value: 'OTHER', label: '❓ Anders', category: 'Overig' },
];

// Default responses (zelfde als in route.ts)
const DEFAULT_RESPONSES: Record<string, { date: string; message: string }> = {
  HIGH_COST: { date: 'even contact op', message: 'We hebben ook flexibele abonnementen. Mogen we je bellen over de mogelijkheden?' },
  FOUND_CHEAPER_ALTERNATIVE: { date: 'even contact op', message: 'We matchen graag andere aanbiedingen. Laat ons weten wat je hebt gevonden!' },
  FINANCIAL_HARDSHIP: { date: 'even contact op', message: 'We begrijpen het. We hebben opties om je te helpen - mogen we je bellen?' },
  LACK_OF_PROGRESS: { date: 'een gratis PT sessie', message: 'We willen je helpen je doelen te bereiken. Gratis personal training sessie?' },
  SLOW_RESULTS: { date: 'een gratis PT sessie', message: 'Laat ons je helpen met een persoonlijk plan. Gratis PT sessie aangeboden!' },
  LOST_INTEREST: { date: 'deze week', message: 'Heb je onze nieuwe groepslessen al gezien? Kom vrijblijvend langs!' },
  FEELING_OVERWHELMED: { date: 'rustig aan', message: 'Begin klein - we helpen je graag met een relaxed schema. Geen druk!' },
  TIME_CONSTRAINTS: { date: 'flexibele tijden', message: 'We zijn doordeweeks 6-23u open. Vroege of late workout past misschien beter?' },
  INCONVENIENT_HOURS: { date: 'onze nieuwe tijden', message: 'We hebben onze openingstijden uitgebreid! Check onze nieuwe uren.' },
  LOCATION_CHANGE: { date: 'veel succes', message: 'Jammer dat je verhuist! Je bent altijd welkom als je in de buurt bent.' },
  COMMUTING_DIFFICULTY: { date: 'even kijken', message: 'Vervoer lastig? We hebben gratis parkeren en zijn goed bereikbaar met OV.' },
  LACK_OF_COMMUNITY: { date: 'onze community events', message: 'We organiseren nu meer groepsactiviteiten! Kom kennismaken met andere leden.' },
  FRIENDS_LEFT: { date: 'een bring-a-friend actie', message: 'Breng een nieuwe vriend gratis mee! Samen sporten is leuker.' },
  UNWELCOMING_ENVIRONMENT: { date: 'persoonlijk contact', message: 'Dit vinden we vervelend om te horen. Mogen we je bellen om dit te bespreken?' },
  POOR_COMMUNICATION: { date: 'verbetering', message: 'Bedankt voor je feedback. We willen dit graag rechtzetten - mogen we bellen?' },
  LACK_OF_ATTENTION: { date: 'een gratis PT sessie', message: 'Je verdient meer aandacht! Gratis personal training om je op weg te helpen?' },
  GENERAL_DISSATISFACTION: { date: 'graag contact', message: 'We horen graag wat er beter kan. Mogen we je bellen voor feedback?' },
  EQUIPMENT_ISSUES: { date: 'goed nieuws', message: 'We hebben geïnvesteerd in nieuwe apparatuur! Kom gerust kijken.' },
  CLEANLINESS_CONCERNS: { date: 'verbeteringen', message: 'We hebben extra schoonmaakrondes ingevoerd. Kom zelf kijken!' },
  HEALTH_ISSUES: { date: 'beterschap', message: 'We hopen dat het snel beter gaat. Je bent altijd welkom terug wanneer je klaar bent.' },
  MAJOR_LIFE_CHANGE: { date: 'succes', message: 'Veel succes met de veranderingen! Onze deur staat altijd open.' },
  TRAVEL_FREQUENCY: { date: 'flexibele opties', message: 'We hebben ook strippenkaarten voor wie veel reist. Interesse?' },
  SELF_SUFFICIENT: { date: 'goed gedaan', message: 'Knap dat je zelfstandig verder gaat! Mocht je ons missen, je bent welkom.' },
  SEASONAL_MEMBER: { date: 'tot snel', message: 'We zien je graag terug volgend seizoen! Tot dan.' },
  BETTER_ALTERNATIVE: { date: 'even contact', message: 'We zijn benieuwd wat je hebt gevonden. Feedback helpt ons verbeteren!' },
  OTHER: { date: 'binnenkort', message: 'We vinden het jammer dat je weggaat. Mogen we vragen waarom?' },
};

interface Config {
  gymName: string;
  testPhone: string;
  welcomeDate: string;
  welcomeMessage: string;
  cancelResponses: Record<string, { date: string; message: string }>;
}

export default function AdminDashboard() {
  const [config, setConfig] = useState<Config>({
    gymName: 'Potentia Gym',
    testPhone: '+31624242177',
    welcomeDate: 'deze week',
    welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
    cancelResponses: DEFAULT_RESPONSES,
  });
  
  const [activeTab, setActiveTab] = useState<'proefles' | 'opzegging' | 'test'>('proefles');
  const [selectedReason, setSelectedReason] = useState('HIGH_COST');
  const [saved, setSaved] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);

  // Load config
  useEffect(() => {
    const savedConfig = localStorage.getItem('gymly-config-v2');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig({ ...config, ...parsed, cancelResponses: { ...DEFAULT_RESPONSES, ...parsed.cancelResponses } });
    }
  }, []);

  // Save config
  const saveConfig = () => {
    localStorage.setItem('gymly-config-v2', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Update cancel response
  const updateCancelResponse = (reason: string, field: 'date' | 'message', value: string) => {
    setConfig({
      ...config,
      cancelResponses: {
        ...config.cancelResponses,
        [reason]: {
          ...config.cancelResponses[reason],
          [field]: value,
        },
      },
    });
  };

  // Test proefles
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
          },
        }),
      });
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
      setWebhookLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Proefles → ${config.testPhone}`, ...prev.slice(0, 9)]);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setTestLoading(false);
    }
  };

  // Test opzegging
  const testOpzegging = async (reason: string) => {
    setTestLoading(true);
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
            cancellationReason: reason,
            membership: { id: 'mem-123', name: 'Basis Abonnement' },
          },
        }),
      });
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
      const reasonLabel = CANCELLATION_REASONS.find(r => r.value === reason)?.label || reason;
      setWebhookLogs(prev => [`[${new Date().toLocaleTimeString()}] 👋 Opzegging (${reasonLabel}) → ${config.testPhone}`, ...prev.slice(0, 9)]);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setTestLoading(false);
    }
  };

  // Group reasons by category
  const groupedReasons = CANCELLATION_REASONS.reduce((acc, reason) => {
    if (!acc[reason.category]) acc[reason.category] = [];
    acc[reason.category].push(reason);
    return acc;
  }, {} as Record<string, typeof CANCELLATION_REASONS>);

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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Verbonden
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('proefles')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'proefles' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📱 Proefles Bericht
          </button>
          <button
            onClick={() => setActiveTab('opzegging')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'opzegging' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👋 Opzegging Berichten
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'test' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🧪 Testen
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gym Settings (always visible) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">🏋️ Gym Instellingen</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gym Naam</label>
                  <input
                    type="text"
                    value={config.gymName}
                    onChange={(e) => setConfig({ ...config, gymName: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Telefoonnummer</label>
                  <input
                    type="text"
                    value={config.testPhone}
                    onChange={(e) => setConfig({ ...config, testPhone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Proefles Tab */}
            {activeTab === 'proefles' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">💬 Proefles Bevestiging</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
                    <input
                      type="text"
                      value={config.welcomeDate}
                      onChange={(e) => setConfig({ ...config, welcomeDate: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Welkomst bericht</label>
                    <textarea
                      value={config.welcomeMessage}
                      onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 h-24"
                    />
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">📱 Preview:</p>
                  <p className="text-sm text-green-700">
                    &quot;Your appointment is coming up on <strong>{config.welcomeDate}</strong> at <strong>{config.welcomeMessage}</strong>. If you need to change it, please reply back and let us know.&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Opzegging Tab */}
            {activeTab === 'opzegging' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">👋 Opzegging Berichten per Reden</h2>
                
                {/* Reason Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selecteer opzeggingsreden:</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 bg-white"
                  >
                    {Object.entries(groupedReasons).map(([category, reasons]) => (
                      <optgroup key={category} label={category}>
                        {reasons.map((reason) => (
                          <option key={reason.value} value={reason.value}>
                            {reason.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Edit Selected Response */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    {CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum tekst</label>
                    <input
                      type="text"
                      value={config.cancelResponses[selectedReason]?.date || ''}
                      onChange={(e) => updateCancelResponse(selectedReason, 'date', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
                    <textarea
                      value={config.cancelResponses[selectedReason]?.message || ''}
                      onChange={(e) => updateCancelResponse(selectedReason, 'message', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 h-24"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-800 mb-1">📱 Preview:</p>
                  <p className="text-sm text-orange-700">
                    &quot;Your appointment is coming up on <strong>{config.cancelResponses[selectedReason]?.date}</strong> at <strong>{config.cancelResponses[selectedReason]?.message}</strong>. If you need to change it, please reply back and let us know.&quot;
                  </p>
                </div>

                {/* Quick test button */}
                <button
                  onClick={() => testOpzegging(selectedReason)}
                  disabled={testLoading}
                  className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {testLoading ? 'Versturen...' : `🧪 Test "${CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label}"`}
                </button>
              </div>
            )}

            {/* Test Tab */}
            {activeTab === 'test' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">🧪 Test Berichten</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={testProefles}
                    disabled={testLoading}
                    className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {testLoading ? 'Versturen...' : '📱 Test Proefles'}
                  </button>
                  <button
                    onClick={() => testOpzegging('OTHER')}
                    disabled={testLoading}
                    className="bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                  >
                    {testLoading ? 'Versturen...' : '👋 Test Opzegging (Algemeen)'}
                  </button>
                </div>

                <h3 className="font-medium text-gray-900 mb-3">Test specifieke opzeggingsreden:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {CANCELLATION_REASONS.slice(0, 8).map((reason) => (
                    <button
                      key={reason.value}
                      onClick={() => testOpzegging(reason.value)}
                      disabled={testLoading}
                      className="text-left px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>

                {testResult && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Resultaat:</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-60">
                      {testResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveConfig}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
            >
              {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Webhook Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">🔗 Webhook URL</h2>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-xs break-all text-gray-700">
                  https://gymly-connect.vercel.app/api/webhooks/gymly
                </code>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Configuratie</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Opzeggingsredenen</span>
                  <span className="text-sm font-medium">{Object.keys(config.cancelResponses).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm text-green-600 font-medium">✓ Actief</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode</span>
                  <span className="text-sm text-yellow-600 font-medium">Sandbox</span>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">📝 Recente Tests</h2>
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