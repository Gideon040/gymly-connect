import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            98% open rate vs 20% bij email
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop met leden verliezen.<br />
            <span className="text-purple-600">Start met WhatsApp.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Gemiddeld verliest een gym <strong>50% van nieuwe leden</strong> binnen 6 maanden. 
            Met WhatsApp automation bereik je 98% van je leden — niet 20% zoals bij email.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
            >
              Start 14 dagen gratis
            </Link>
            <Link 
              href="#calculator" 
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50 transition-all"
            >
              Bereken je besparing
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <span>✓ Geen creditcard nodig</span>
            <span>✓ Gymly integratie</span>
            <span>✓ Binnen 5 min live</span>
          </div>
        </div>
      </section>

      {/* Problem Stats */}
      <section className="py-16 bg-red-50 border-y border-red-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Het probleem met email</h2>
            <p className="text-gray-600">Waarom je huidige communicatie niet werkt</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center border border-red-100">
              <div className="text-4xl font-bold text-red-600 mb-2">20%</div>
              <div className="text-sm text-gray-600">Email open rate</div>
              <div className="text-xs text-gray-400 mt-1">Bron: Mailchimp 2024</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-red-100">
              <div className="text-4xl font-bold text-red-600 mb-2">50%</div>
              <div className="text-sm text-gray-600">Leden weg binnen 6 maanden</div>
              <div className="text-xs text-gray-400 mt-1">Bron: IHRSA Report</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-red-100">
              <div className="text-4xl font-bold text-red-600 mb-2">5-10×</div>
              <div className="text-sm text-gray-600">Duurder om nieuwe leden te werven</div>
              <div className="text-xs text-gray-400 mt-1">Bron: Harvard Business Review</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-red-100">
              <div className="text-4xl font-bold text-red-600 mb-2">€240K</div>
              <div className="text-sm text-gray-600">Verlies per jaar (1000 leden, 40% churn)</div>
              <div className="text-xs text-gray-400 mt-1">Bij €50/maand gemiddeld</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Stats */}
      <section className="py-16 bg-green-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">De oplossing: WhatsApp</h2>
            <p className="text-gray-600">Bewezen resultaten van WhatsApp marketing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">WhatsApp open rate</div>
              <div className="text-xs text-gray-400 mt-1">Bron: Meta Business 2024</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">45-60%</div>
              <div className="text-sm text-gray-600">Click-through rate</div>
              <div className="text-xs text-gray-400 mt-1">vs 2-5% bij email</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">Hogere retentie met WhatsApp</div>
              <div className="text-xs text-gray-400 mt-1">Bron: MessageBird 2024</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">2.5×</div>
              <div className="text-sm text-gray-600">Hogere ROI dan email</div>
              <div className="text-xs text-gray-400 mt-1">€90 vs €36 per €1 spend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Wat kost ledenverlies jou?
            </h2>
            <p className="text-lg text-gray-600">
              Een gemiddelde gym met 500 leden en 40% jaarlijkse churn verliest:
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-10 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">200</div>
                <div className="text-purple-200">Leden verloren per jaar</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">€120K</div>
                <div className="text-purple-200">Omzetverlies per jaar</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">€12-24K</div>
                <div className="text-purple-200">Wervingskosten nieuwe leden</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <div className="text-center">
                <div className="text-sm text-purple-200 mb-2">Als je churn met 10% verlaagt door betere communicatie:</div>
                <div className="text-3xl font-bold">€12.000 - €18.000 extra omzet per jaar</div>
                <div className="text-purple-200 mt-2">Dat is 20-30× je investering in GymlyConnect</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Berekening: 500 leden × €50/maand × 40% churn = 200 leden × €600/jaar = €120.000 verlies
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              WhatsApp vs Email: de cijfers
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Metric</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-red-600">Email</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-green-600">WhatsApp</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-purple-600">Verschil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Open rate</td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">20%</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">98%</td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-bold">+390%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Click-through rate</td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">2-5%</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">45-60%</td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-bold">+1000%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Reactietijd klant</td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">24-48 uur</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">90 sec</td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-bold">1000× sneller</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">ROI per €1 spend</td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">€36</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">€90</td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-bold">+150%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Klant voorkeur</td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">35%</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">65%</td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-bold">+86%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-4 text-xs text-gray-500">
            Bronnen: Meta Business, Mailchimp, HubSpot, MessageBird (2024)
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4 automations die leden behouden
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elke automation is gebaseerd op bewezen momenten waar je leden verliest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-green-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📱
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proefles Bevestiging</h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Probleem:</strong> 40% van proefles aanmeldingen komt niet opdagen.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Oplossing:</strong> Direct WhatsApp bericht na aanmelding. 
                    Persoonlijk, warm, met praktische info.
                  </p>
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <span>📈</span>
                    <span>Gyms zien 25-40% hogere show-up rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-orange-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  💪
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Win-back bij Opzegging</h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Probleem:</strong> Opzeggers krijgen een standaard email die niemand leest.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Oplossing:</strong> Gepersonaliseerd WhatsApp per opzegreden. 
                    "Te duur" krijgt ander bericht dan "geen tijd".
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                    <span>📈</span>
                    <span>Tot 37% win-back rate (vs 5% bij email)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-purple-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🔔
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Inactieve Leden Activeren</h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Probleem:</strong> 63% van leden gebruikt hun abonnement niet actief. 
                    Ze vergeten je, en zeggen op.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Oplossing:</strong> Automatische check-in na 30 en 60 dagen inactiviteit. 
                    Vriendelijk, niet pushy.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                    <span>📈</span>
                    <span>Leden die 8×/maand komen churnen 50% minder</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🎂
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Verjaardag Felicitaties</h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Probleem:</strong> Leden voelen zich "gewoon een nummer". 
                    Geen persoonlijke connectie.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Oplossing:</strong> Persoonlijke felicitatie op hun verjaardag. 
                    Klein gebaar, groot effect.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <span>📈</span>
                    <span>64% voelt sterkere band met gym via WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 border border-gray-200">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">💬</div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6 leading-relaxed">
                "Onze show-up rate voor proeflessen is gestegen van 60% naar 85% sinds we 
                WhatsApp bevestigingen versturen. En we hebben al 12 opzeggers teruggewonnen 
                deze maand — dat was voorheen 0."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-purple-600">PG</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Potentia Gym</div>
                  <div className="text-gray-500 text-sm">Rotterdam • 500+ leden</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">+42%</div>
                <div className="text-sm text-gray-500">Show-up rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-500">Leden teruggewonnen/maand</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">€7.200</div>
                <div className="text-sm text-gray-500">Extra omzet/jaar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Investeer €49, bespaar €12.000+
            </h2>
            <p className="text-lg text-gray-600">
              Terugverdiend met 1 behouden lid per maand
            </p>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-3xl p-10 max-w-lg mx-auto relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Meest gekozen
              </span>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €49<span className="text-xl text-gray-500 font-normal">/maand</span>
              </div>
              <p className="text-gray-500 mb-8">Per locatie • Onbeperkt berichten</p>
              
              <ul className="text-left space-y-4 mb-8">
                {[
                  'Onbeperkt WhatsApp berichten',
                  'Proefles bevestigingen (direct na aanmelding)',
                  'Win-back bij opzegging (26 redenen)',
                  'Inactieve leden reminders (30 + 60 dagen)',
                  'Verjaardag felicitaties',
                  'Volledige Gymly integratie',
                  'Dashboard met statistieken',
                  'Persoonlijke onboarding',
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
              <p className="text-sm text-gray-500 mt-4">Geen creditcard nodig • Direct live</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
              <span>💡</span>
              <span>1 behouden lid (€50/maand × 12 maanden) = €600 extra omzet. ROI: 1.122%</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Veelgestelde vragen</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Hoe werkt de Gymly integratie?',
                a: 'GymlyConnect verbindt direct met je Gymly account via hun API. Nieuwe leads, opzeggingen en check-in data worden automatisch gesynchroniseerd. Setup duurt 5 minuten.'
              },
              {
                q: 'Is dit GDPR-compliant?',
                a: 'Ja. WhatsApp Business API is volledig GDPR-compliant. Leden moeten opt-in geven voor marketing berichten, wat automatisch gebeurt bij aanmelding via Gymly.'
              },
              {
                q: 'Wat als een lid niet op WhatsApp zit?',
                a: 'In Nederland gebruikt 98% van de bevolking WhatsApp. Voor de zeldzame gevallen zonder WhatsApp kun je een fallback email instellen.'
              },
              {
                q: 'Hoeveel berichten kan ik versturen?',
                a: 'Onbeperkt. Of je nu 100 of 10.000 leden hebt, je betaalt hetzelfde. Geen verborgen kosten per bericht.'
              },
              {
                q: 'Kan ik de berichten aanpassen?',
                a: 'Volledig. Je past alle teksten aan in je dashboard. Per opzegreden, per automation. Jouw tone of voice, jouw gym.'
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Elke dag dat je wacht, verlies je leden
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Met een gemiddelde churn van 40% per jaar verliest een gym met 500 leden 
            <strong> elke week 4 leden</strong>. Hoeveel had je kunnen behouden met een simpel WhatsApp bericht?
          </p>
          <Link 
            href="/login" 
            className="inline-flex px-8 py-4 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
          >
            Start nu — 14 dagen gratis
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>✓ Geen creditcard</span>
            <span>✓ 5 min setup</span>
            <span>✓ Direct berichten versturen</span>
          </div>
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
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
            Statistieken gebaseerd op onderzoek van Meta Business, Mailchimp, HubSpot, IHRSA, MessageBird en Harvard Business Review (2024)
          </div>
        </div>
      </footer>
    </div>
  );
}