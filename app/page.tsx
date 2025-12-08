import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="relative bg-white">
        <div className="px-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto py-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">GymlyConnect</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Inloggen</Link>
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                Start gratis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Link 
            href="#stats" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-8 hover:bg-green-100 transition-all"
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            98% open rate — 5× hoger dan email →
          </Link>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-[0.95]">
            <span className="block">Stop met leden</span>
            <span className="block text-purple-600">verliezen.</span>
          </h1>
        </div>
      </section>

      {/* Product Screenshot */}
      <section className="relative px-6">
        <div className="max-w-7xl mx-auto">
          {/* Browser mockup */}
          <div className="relative rounded-t-2xl overflow-hidden bg-gray-900 shadow-2xl">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-gray-700 rounded-md text-gray-400 text-sm">
                  dashboard.gymlyconnect.nl
                </div>
              </div>
            </div>
            
            {/* Dashboard mockup */}
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
              <div className="h-full bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Berichten vandaag', value: '47', color: 'purple' },
                    { label: 'Open rate', value: '98%', color: 'green' },
                    { label: 'Win-backs', value: '12', color: 'orange' },
                    { label: 'Response tijd', value: '< 3min', color: 'blue' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className={`text-2xl font-bold ${
                        stat.color === 'purple' ? 'text-purple-400' :
                        stat.color === 'green' ? 'text-green-400' :
                        stat.color === 'orange' ? 'text-orange-400' :
                        'text-blue-400'
                      }`}>{stat.value}</div>
                      <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* Chart placeholder */}
                <div className="flex-1 bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 98].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-gray-600 text-xs mt-2">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient fade to next section */}
        <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-slate-100 to-transparent"></div>
      </section>

      {/* Value Prop */}
      <section className="relative bg-slate-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Gyms verliezen gemiddeld <span className="text-red-500">50% van nieuwe leden</span> binnen 6 maanden. 
            De meeste krijgen een email die niemand leest.{' '}
            <span className="text-purple-600">WhatsApp heeft 98% open rate.</span>{' '}
            Do the math.
          </p>
          <Link 
            href="/login" 
            className="inline-block mt-10 text-xl text-gray-500 font-semibold hover:text-purple-600 transition-all"
          >
            Start vandaag nog met WhatsApp automation →
          </Link>
        </div>
      </section>

      {/* Feature 1 - Dark */}
      <section className="bg-gray-900 py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-lime-400 uppercase tracking-widest font-semibold">
                Proefles confirmatie
              </span>
              <h2 className="mt-6 text-3xl lg:text-5xl font-bold text-white leading-tight">
                Van aanmelding naar <em className="text-lime-400">opdagen</em>.
              </h2>
              <p className="mt-6 text-xl text-gray-400 leading-relaxed">
                40% van proefles aanmeldingen komt niet opdagen. 
                Een automatisch WhatsApp bericht direct na aanmelding verandert dat.
              </p>
              <p className="mt-4 text-xl text-gray-400 leading-relaxed">
                Persoonlijk. Warm. Met parkeerinfo en wat ze moeten meenemen.
                Gyms zien hun show-up rate stijgen van 60% naar 85%.
              </p>
              <p className="mt-6 text-xl text-white font-medium">
                +42% meer proeflessen die daadwerkelijk komen.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              {/* Phone mockup */}
              <div className="relative mx-auto w-[300px]">
                <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl border border-gray-700">
                  <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden">
                    {/* Phone header */}
                    <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">PG</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Potentia Gym</div>
                        <div className="text-green-100 text-xs">Online</div>
                      </div>
                    </div>
                    
                    {/* Chat */}
                    <div className="bg-[#0b141a] p-4 min-h-[400px]">
                      <div className="bg-[#005c4b] rounded-lg p-3 ml-auto max-w-[85%] mb-3">
                        <p className="text-white text-sm">
                          Hey Lisa! 🎉 Super dat je je hebt aangemeld voor een proefles bij Potentia Gym!
                        </p>
                        <p className="text-white text-sm mt-2">
                          Je proefles staat gepland voor <strong>woensdag 15 jan om 19:00</strong>.
                        </p>
                        <p className="text-white text-sm mt-2">
                          📍 Westerstraat 42, Rotterdam<br/>
                          🅿️ Gratis parkeren achter het gebouw<br/>
                          👟 Neem sportkleding en een handdoek mee
                        </p>
                        <p className="text-white text-sm mt-2">
                          Heb je nog vragen? Stuur gerust een berichtje!
                        </p>
                        <div className="text-green-200 text-xs mt-2 text-right">14:32 ✓✓</div>
                      </div>
                      
                      <div className="bg-[#1f2c34] rounded-lg p-3 max-w-[75%] mb-3">
                        <p className="text-white text-sm">Top! Tot woensdag 💪</p>
                        <div className="text-gray-400 text-xs mt-1 text-right">14:33</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Light */}
      <section className="bg-white py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-last lg:order-first">
              {/* Win-back flow visualization */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <div className="space-y-4">
                  {/* Trigger */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 text-xl">⚠️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Opzegging gedetecteerd</div>
                        <div className="text-sm text-gray-500">Reden: "Te duur"</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  
                  {/* Message selection */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-xl">🎯</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Gepersonaliseerd template</div>
                        <div className="text-sm text-gray-500">Win-back: prijsgevoelig</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  
                  {/* Result */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Lid behouden!</div>
                        <div className="text-sm text-gray-500">Daluren abonnement geaccepteerd</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <span className="text-xs text-orange-600 uppercase tracking-widest font-semibold">
                Win-back automation
              </span>
              <h2 className="mt-6 text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Elke opzegreden, <em className="text-orange-600">eigen aanpak</em>.
              </h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                "Te duur" krijgt een ander bericht dan "geen tijd" of "verhuizing". 
                26 verschillende opzegreasons, 26 gepersonaliseerde win-back flows.
              </p>
              <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                Een standaard email heeft 5% win-back rate.
                WhatsApp met de juiste boodschap? Tot 37%.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="text-4xl font-bold text-orange-600">37%</div>
                <div className="text-gray-600">
                  win-back rate<br/>
                  <span className="text-sm text-gray-400">vs 5% bij email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-lime-400 uppercase tracking-widest font-semibold">
              De cijfers
            </span>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-white">
              WhatsApp vs Email
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Email */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="text-gray-400 font-medium mb-6">📧 Email marketing</div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">Open rate</span>
                    <span className="text-2xl font-bold text-red-400">20%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">Click-through</span>
                    <span className="text-2xl font-bold text-red-400">2-5%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">ROI per €1</span>
                    <span className="text-2xl font-bold text-gray-400">€36</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-green-900/50 to-gray-800 rounded-2xl p-8 border border-green-700/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                WINNER
              </div>
              <div className="text-green-400 font-medium mb-6">💬 WhatsApp</div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">Open rate</span>
                    <span className="text-2xl font-bold text-green-400">98%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">Click-through</span>
                    <span className="text-2xl font-bold text-green-400">45-60%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400">ROI per €1</span>
                    <span className="text-2xl font-bold text-green-400">€90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-8">
            Bronnen: Meta Business, Mailchimp, HubSpot, MessageBird (2024)
          </p>
        </div>
      </section>

      {/* Feature 3 - Light */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-purple-600 uppercase tracking-widest font-semibold">
                Inactieve leden
              </span>
              <h2 className="mt-6 text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                63% gebruikt hun abonnement niet.
              </h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Ze vergeten je. Ze zeggen op. Voorspelbaar als een klok.
              </p>
              <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                Een vriendelijke check-in na 30 dagen stilte. Niet pushy, wel effectief. 
                Leden die 8× per maand komen, churnen 50% minder.
              </p>
              <p className="mt-6 text-xl text-gray-900 font-medium">
                Breng ze terug voordat ze weg zijn.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              {/* Timeline visualization */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-purple-200"></div>
                  
                  {/* Events */}
                  <div className="space-y-8">
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center z-10">
                        <span className="text-green-600">✓</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Laatste check-in</div>
                        <div className="text-gray-500">15 november</div>
                      </div>
                    </div>
                    
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center z-10">
                        <span className="text-yellow-600">⚠️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">30 dagen inactief</div>
                        <div className="text-gray-500">15 december</div>
                        <div className="mt-2 bg-purple-50 rounded-lg p-3 text-sm">
                          <strong>WhatsApp verzonden:</strong> "Hey! We missen je bij Potentia..."
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center z-10">
                        <span className="text-green-600">💪</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Lid terug!</div>
                        <div className="text-gray-500">17 december</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <svg className="absolute -top-8 -left-4 w-16 h-16 text-purple-100" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
            </svg>
            
            <blockquote className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
              Onze show-up rate is van 60% naar 85% gegaan. 
              En we hebben al 12 opzeggers teruggewonnen deze maand — 
              <span className="text-purple-600">dat was voorheen 0</span>.
            </blockquote>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">PG</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-lg">Potentia Gym</div>
              <div className="text-gray-500">Rotterdam • 500+ leden</div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-green-600">+42%</div>
              <div className="text-gray-500 text-sm mt-1">show-up rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600">12</div>
              <div className="text-gray-500 text-sm mt-1">leden teruggewonnen/maand</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">€7.200</div>
              <div className="text-gray-500 text-sm mt-1">extra omzet/jaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs text-lime-400 uppercase tracking-widest font-semibold">
                Simpele pricing
              </span>
              <h2 className="mt-6 text-3xl lg:text-5xl font-bold text-white leading-tight">
                €49/maand.<br/>
                <span className="text-gray-400">Onbeperkt berichten.</span>
              </h2>
              <p className="mt-6 text-xl text-gray-400 leading-relaxed">
                Per locatie. Geen hidden fees. Geen kosten per bericht. 
                Of je nu 100 of 10.000 leden hebt.
              </p>
              <p className="mt-4 text-xl text-gray-400 leading-relaxed">
                Terugverdiend met 1 behouden lid per maand.
              </p>
              
              <div className="mt-10 p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="text-gray-400 text-sm mb-2">ROI berekening</div>
                <div className="text-white">
                  <span className="text-2xl font-bold">1 lid</span>
                  <span className="text-gray-400"> × €50/maand × 12 maanden = </span>
                  <span className="text-2xl font-bold text-lime-400">€600</span>
                </div>
                <div className="text-gray-500 mt-2">
                  Investering: €588/jaar → ROI: <span className="text-lime-400 font-semibold">1.020%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 lg:p-10">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-gray-900">€49</span>
                <span className="text-gray-500">/maand per locatie</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Onbeperkt WhatsApp berichten',
                  'Proefles bevestigingen',
                  'Win-back bij opzegging (26 redenen)',
                  'Inactieve leden reminders',
                  'Verjaardag felicitaties',
                  'Volledige Gymly integratie',
                  'Dashboard met analytics',
                  'Persoonlijke onboarding',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/login" 
                className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-center hover:bg-gray-800 transition-all"
              >
                Start 14 dagen gratis →
              </Link>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Geen creditcard nodig
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs text-purple-600 uppercase tracking-widest font-semibold">
            Begin vandaag
          </span>
          <h2 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Elke dag dat je wacht,<br/>
            verlies je leden.
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Met een gemiddelde churn van 40% per jaar verliest een gym met 500 leden 
            <strong> elke week 4 leden</strong>. Hoeveel had je kunnen behouden?
          </p>
          <Link 
            href="/login" 
            className="inline-block mt-10 px-8 py-4 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
          >
            Start nu — 14 dagen gratis
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>✓ Geen creditcard</span>
            <span>✓ 5 min setup</span>
            <span>✓ Direct live</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-semibold text-xl text-white">GymlyConnect</span>
            </div>
            
            <nav className="flex items-center gap-8 text-gray-400">
              <Link href="#features" className="hover:text-white transition-all">Features</Link>
              <Link href="#pricing" className="hover:text-white transition-all">Pricing</Link>
              <Link href="/login" className="hover:text-white transition-all">Inloggen</Link>
              <a href="mailto:info@gymlyconnect.nl" className="hover:text-white transition-all">Contact</a>
            </nav>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>© 2024 GymlyConnect. Alle rechten voorbehouden.</p>
            <p>
              Data gebaseerd op onderzoek van Meta Business, Mailchimp, HubSpot, IHRSA en Harvard Business Review (2024)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}