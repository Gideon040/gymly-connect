import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-[15px] text-gray-900">GymlyConnect</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Inloggen</Link>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-medium hover:bg-[#5B21B6] transition-all"
            >
              Start gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero - Compact */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDE9FE] text-[#7C3AED] rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                98% open rate — 5× hoger dan email
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Stop met leden verliezen.
                <span className="text-[#7C3AED]"> Start met WhatsApp.</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gyms verliezen 50% van nieuwe leden binnen 6 maanden. 
                De meeste krijgen een email die niemand leest. 
                WhatsApp heeft 98% open rate. Do the math.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/login" 
                  className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg font-medium hover:bg-[#5B21B6] transition-all"
                >
                  Start 14 dagen gratis
                </Link>
                <Link 
                  href="#demo" 
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Bekijk demo
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Geen creditcard
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5 min setup
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gymly integratie
                </span>
              </div>
            </div>
            
            {/* Right: Image placeholder - gym atmosphere */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#EDE9FE] to-[#D1FAE5]">
                {/* Placeholder for gym image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center">
                      <span className="text-4xl">💪</span>
                    </div>
                    <p className="text-gray-600 text-sm">Gym sfeer foto</p>
                    <p className="text-gray-400 text-xs mt-1">800 x 600px</p>
                  </div>
                </div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                    <span className="text-[#10B981] font-bold">98%</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Open rate</div>
                    <div className="text-xs text-gray-500">vs 20% bij email</div>
                  </div>
                </div>
              </div>
              
              {/* Floating message card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-[200px]">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓✓</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">WhatsApp</div>
                    <div className="text-sm text-gray-900">"Hey Lisa! Super dat je..."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof Bar */}
      <section className="py-12 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8">Vertrouwd door sportscholen in heel Nederland</p>
          <div className="flex items-center justify-center gap-12 opacity-60">
            {/* Placeholder logos */}
            <div className="w-24 h-8 bg-gray-300 rounded"></div>
            <div className="w-28 h-8 bg-gray-300 rounded"></div>
            <div className="w-20 h-8 bg-gray-300 rounded"></div>
            <div className="w-24 h-8 bg-gray-300 rounded hidden md:block"></div>
            <div className="w-28 h-8 bg-gray-300 rounded hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Stats comparison */}
            <div className="order-last lg:order-first">
              <div className="grid grid-cols-2 gap-4">
                {/* Email stats */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-4">📧 Email</div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Open rate</span>
                        <span className="font-semibold text-gray-900">20%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-gray-400 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">CTR</span>
                        <span className="font-semibold text-gray-900">2-5%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-gray-400 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* WhatsApp stats */}
                <div className="bg-[#EDE9FE] rounded-xl p-6 border border-[#7C3AED]/20">
                  <div className="text-sm font-medium text-[#7C3AED] mb-4">💬 WhatsApp</div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Open rate</span>
                        <span className="font-semibold text-[#7C3AED]">98%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full">
                        <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">CTR</span>
                        <span className="font-semibold text-[#7C3AED]">45-60%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full">
                        <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                Bronnen: Meta Business, Mailchimp, HubSpot (2024)
              </p>
            </div>
            
            {/* Text */}
            <div>
              <span className="text-xs text-[#7C3AED] uppercase tracking-widest font-semibold">
                Het probleem
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 leading-tight">
                Jouw berichten komen niet aan.
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Elke gym stuurt emails. Proefles bevestigingen, opzeg-verzoeken, herinneringen. 
                Het probleem? <strong>80% wordt nooit geopend.</strong>
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                WhatsApp is waar je leden zijn. 98% open rate. Binnen 3 minuten gelezen. 
                Persoonlijk contact zonder extra werk.
              </p>
              <div className="mt-8 p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/20">
                <div className="flex items-start gap-3">
                  <span className="text-[#F59E0B]">💡</span>
                  <p className="text-sm text-gray-700">
                    <strong>Wist je dat?</strong> Een gym met 500 leden en 40% churn verliest 
                    <strong> €120.000 per jaar</strong> aan omzet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-[#7C3AED] uppercase tracking-widest font-semibold">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              4 automations die leden behouden
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 - Proefles */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Proefles Bevestiging</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Direct WhatsApp na aanmelding. Persoonlijk, warm, met parkeerinfo en wat ze moeten meenemen.
                  </p>
                  <div className="flex items-center gap-2 text-[#10B981] text-sm font-medium">
                    <span>+42% show-up rate</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Win-back */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Win-back bij Opzegging</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Gepersonaliseerd per opzegreden. "Te duur" krijgt ander bericht dan "geen tijd".
                  </p>
                  <div className="flex items-center gap-2 text-[#F59E0B] text-sm font-medium">
                    <span>37% win-back rate</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 3 - Inactief */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#EDE9FE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Inactieve Leden Activeren</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Vriendelijke check-in na 30/60 dagen stilte. Niet pushy, wel effectief.
                  </p>
                  <div className="flex items-center gap-2 text-[#7C3AED] text-sm font-medium">
                    <span>50% minder churn</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 4 - Verjaardag */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎂</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Verjaardag Felicitaties</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Persoonlijke felicitatie. Klein gebaar, groot effect op loyaliteit.
                  </p>
                  <div className="flex items-center gap-2 text-[#3B82F6] text-sm font-medium">
                    <span>64% sterkere band</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works + Phone Mockup */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-[280px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    {/* Phone status bar */}
                    <div className="bg-[#10B981] px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">PG</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Potentia Gym</div>
                        <div className="text-white/70 text-xs">Online</div>
                      </div>
                    </div>
                    
                    {/* Chat */}
                    <div className="bg-[#ECE5DD] p-3 min-h-[350px]">
                      {/* Message bubble */}
                      <div className="bg-[#DCF8C6] rounded-lg p-3 max-w-[90%] ml-auto mb-3 shadow-sm">
                        <p className="text-gray-900 text-sm leading-relaxed">
                          Hey Lisa! 🎉 Super dat je je hebt aangemeld voor een proefles!
                        </p>
                        <p className="text-gray-900 text-sm leading-relaxed mt-2">
                          📍 Westerstraat 42, Rotterdam<br/>
                          🕐 Woensdag 15 jan, 19:00<br/>
                          🅿️ Gratis parkeren achter gebouw
                        </p>
                        <p className="text-gray-900 text-sm leading-relaxed mt-2">
                          Vragen? Stuur gerust een berichtje! 💪
                        </p>
                        <div className="text-gray-500 text-xs mt-2 text-right">14:32 ✓✓</div>
                      </div>
                      
                      {/* Reply */}
                      <div className="bg-white rounded-lg p-3 max-w-[70%] shadow-sm">
                        <p className="text-gray-900 text-sm">Top! Tot woensdag 🙌</p>
                        <div className="text-gray-500 text-xs mt-1 text-right">14:33</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-8 w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </div>
            
            {/* Steps */}
            <div>
              <span className="text-xs text-[#7C3AED] uppercase tracking-widest font-semibold">
                Hoe het werkt
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 mb-8">
                In 3 stappen live
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Koppel Gymly</h3>
                    <p className="text-gray-600 text-sm">Eenmalige setup van 5 minuten. Wij helpen je erdoorheen.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pas templates aan</h3>
                    <p className="text-gray-600 text-sm">Pas de berichten aan naar jouw tone of voice en branding.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Automatisch versturen</h3>
                    <p className="text-gray-600 text-sm">Berichten gaan automatisch uit. Jij focust op je leden.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-[#7C3AED]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💬</span>
          </div>
          
          <blockquote className="text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8">
            "Onze show-up rate is van 60% naar 85% gegaan. En we hebben al 12 opzeggers 
            teruggewonnen deze maand — dat was voorheen 0."
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">PG</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Potentia Gym</div>
              <div className="text-white/70 text-sm">Rotterdam • 500+ leden</div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-bold text-white">+42%</div>
              <div className="text-white/70 text-sm">show-up</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-white/70 text-sm">win-backs/mnd</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">€7.2K</div>
              <div className="text-white/70 text-sm">extra/jaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Pricing info */}
            <div>
              <span className="text-xs text-[#7C3AED] uppercase tracking-widest font-semibold">
                Pricing
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 mb-6">
                Simpel. €49/maand.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Per locatie. Onbeperkt berichten. Geen hidden fees.
                Terugverdiend met 1 behouden lid per maand.
              </p>
              
              {/* ROI Calculator */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-3">ROI Berekening</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">1 lid behouden</span>
                </div>
                <div className="text-gray-600 text-sm mb-4">
                  = €50/maand × 12 maanden = <strong className="text-[#10B981]">€600 extra omzet</strong>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investering per jaar</span>
                    <span className="font-semibold text-gray-900">€588</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold text-[#10B981]">1.020%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Pricing card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#7C3AED] shadow-lg">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">€49</span>
                <span className="text-gray-500">/maand per locatie</span>
              </div>
              
              <ul className="space-y-3 mb-8">
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
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/login" 
                className="block w-full py-3 bg-[#7C3AED] text-white rounded-lg font-semibold text-center hover:bg-[#5B21B6] transition-all"
              >
                Start 14 dagen gratis
              </Link>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Geen creditcard nodig
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Klaar om te starten?
          </h2>
          <p className="text-gray-600 mb-8">
            Elke week dat je wacht, verlies je leden die je had kunnen behouden.
          </p>
          <Link 
            href="/login" 
            className="inline-flex px-8 py-4 bg-[#7C3AED] text-white rounded-lg font-semibold hover:bg-[#5B21B6] transition-all"
          >
            Start 14 dagen gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="font-semibold text-gray-900">GymlyConnect</span>
            </div>
            
            <nav className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#features" className="hover:text-gray-900">Features</Link>
              <Link href="#pricing" className="hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="hover:text-gray-900">Inloggen</Link>
              <a href="mailto:info@gymlyconnect.nl" className="hover:text-gray-900">Contact</a>
            </nav>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 GymlyConnect. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
