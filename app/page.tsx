import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Proefles Bevestigingen',
      description: 'Automatisch WhatsApp bericht wanneer een lead zich aanmeldt. Verhoog je show-up rate met persoonlijke berichten.',
      icon: '📱',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Win-back bij Opzegging',
      description: 'Gepersonaliseerde berichten per opzegreden. Win tot 37% van je opzeggers terug met slimme follow-ups.',
      icon: '💪',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Inactieve Leden Activeren',
      description: 'Automatische herinneringen na 30 en 60 dagen inactiviteit. Houd je leden betrokken en actief.',
      icon: '🔔',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Verjaardag Felicitaties',
      description: 'Verras je leden met een persoonlijke felicitatie op hun verjaardag. Bouw een sterke band op.',
      icon: '🎂',
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  const stats = [
    { value: '98%', label: 'Open rate WhatsApp' },
    { value: '37%', label: 'Win-back rate' },
    { value: '< 3 min', label: 'Reactietijd' },
    { value: '24/7', label: 'Automatisch actief' },
  ];

  const steps = [
    { step: '1', title: 'Koppel je Gymly', description: 'Verbind je Gymly account in enkele klikken' },
    { step: '2', title: 'Stel je berichten in', description: 'Personaliseer je WhatsApp templates' },
    { step: '3', title: 'Automatisch verzenden', description: 'Berichten worden automatisch verstuurd' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-gray-900">GymlyConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-all">
              Inloggen
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all"
            >
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Nu beschikbaar voor Gymly gebruikers
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            WhatsApp Automation<br />
            <span className="text-purple-600">voor Sportscholen</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Automatiseer je ledencommunicatie via WhatsApp. Van proefles bevestigingen 
            tot win-back campagnes. Meer engagement, minder handwerk.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
            >
              Start gratis proefperiode
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50 transition-all"
            >
              Bekijk features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Automatiseer je volledige ledencommunicatie via WhatsApp. 
              Geïntegreerd met Gymly, klaar in minuten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-purple-200 transition-all"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Binnen 5 minuten operationeel
            </h2>
            <p className="text-lg text-gray-600">
              Geen technische kennis nodig. Koppel, configureer en verstuur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-10 text-center text-white">
            <div className="text-5xl mb-6">💬</div>
            <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
              "Sinds we GymlyConnect gebruiken is onze show-up rate voor proefles 
              gestegen van 60% naar 85%. De win-back berichten hebben ons al 
              tientallen leden teruggebracht."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-semibold">PG</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Potentia Gym</div>
                <div className="text-purple-200 text-sm">Rotterdam</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simpele, transparante pricing
            </h2>
            <p className="text-lg text-gray-600">
              Geen verrassingen. Betaal alleen voor wat je gebruikt.
            </p>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-3xl p-10 max-w-lg mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Meest gekozen
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €49<span className="text-xl text-gray-500 font-normal">/maand</span>
              </div>
              <p className="text-gray-500 mb-8">Per locatie, onbeperkt berichten</p>
              
              <ul className="text-left space-y-4 mb-8">
                {[
                  'Onbeperkt WhatsApp berichten',
                  'Proefles bevestigingen',
                  'Win-back bij opzegging (26 redenen)',
                  'Inactieve leden reminders',
                  'Verjaardag felicitaties',
                  'Gymly integratie',
                  'Dashboard met statistieken',
                  'Email support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/login" 
                className="block w-full py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all"
              >
                Start 14 dagen gratis
              </Link>
              <p className="text-sm text-gray-500 mt-4">Geen creditcard nodig</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Klaar om je ledencommunicatie te automatiseren?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start vandaag nog en zie binnen een week resultaat.
          </p>
          <Link 
            href="/login" 
            className="inline-flex px-8 py-4 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
          >
            Gratis account aanmaken
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="font-semibold text-gray-900">GymlyConnect</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <Link href="/login" className="hover:text-gray-900 transition-all">Inloggen</Link>
              <a href="mailto:info@gymlyconnect.nl" className="hover:text-gray-900 transition-all">Contact</a>
              <span>© 2024 GymlyConnect</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}