import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-gray-900">GymlyConnect</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Start gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <span className="text-sm text-gray-600">Vertrouwd door 50+ sportscholen</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            WhatsApp automation voor<br />
            <span className="text-purple-600">sportscholen.</span>
          </h1>
          
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Behoud meer leden met geautomatiseerde WhatsApp berichten. 
            Proefles bevestigingen, win-back flows en inactieve leden reminders.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
            >
              Start gratis
            </Link>
            <Link 
              href="#demo" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              of Bekijk demo
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Gratis account in 1 min
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Geen creditcard nodig
            </span>
          </div>
        </div>
      </section>

      {/* Dashboard Screenshot */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-white rounded text-gray-500 text-xs border border-gray-200">
                  dashboard.gymlyconnect.nl
                </div>
              </div>
            </div>
            
            {/* Dashboard content */}
            <div className="bg-gray-50 p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">47</div>
                    <div className="text-sm text-gray-500">Berichten vandaag</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-500">Open rate</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-500">Win-backs</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">&lt; 3min</div>
                    <div className="text-sm text-gray-500">Response tijd</div>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-48 flex items-end gap-2">
                  {[35, 45, 40, 60, 55, 70, 65, 80, 75, 85, 80, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-purple-100 rounded-t hover:bg-purple-200 transition-colors" style={{ height: `${h}%` }}>
                      <div className="w-full bg-purple-500 rounded-t" style={{ height: '40%' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value prop section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            De slimme manier om leden te behouden
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Gyms verliezen gemiddeld 50% van nieuwe leden binnen 6 maanden. 
            De meeste krijgen een email die niemand leest. WhatsApp heeft 98% open rate.
          </p>
        </div>
        
        {/* Feature cards - Gymly style */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Proefles bevestiging</h3>
            <p className="text-gray-600 text-sm">
              Automatisch WhatsApp bericht direct na aanmelding. Persoonlijk, met parkeerinfo en wat ze moeten meenemen.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Win-back automation</h3>
            <p className="text-gray-600 text-sm">
              26 verschillende opzegreasons, 26 gepersonaliseerde win-back flows. Tot 37% win-back rate.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Inactieve leden</h3>
            <p className="text-gray-600 text-sm">
              Vriendelijke check-in na 30 dagen stilte. Leden die 8× per maand komen, churnen 50% minder.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 1 - With real gym image */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm text-purple-600 font-medium">Proefles confirmatie</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Van aanmelding naar opdagen.
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                40% van proefles aanmeldingen komt niet opdagen. Een automatisch WhatsApp bericht 
                direct na aanmelding verandert dat. Persoonlijk. Warm. Met parkeerinfo en wat ze moeten meenemen.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Gyms zien hun show-up rate stijgen van 60% naar 85%.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="text-3xl font-bold text-purple-600">+42%</div>
                <div className="text-sm text-gray-500">meer proeflessen die<br/>daadwerkelijk komen</div>
              </div>
            </div>
            
            <div className="relative">
              {/* Phone mockup with WhatsApp */}
              <div className="relative mx-auto" style={{ maxWidth: '300px' }}>
                <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-xl">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden">
                    {/* WhatsApp header */}
                    <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">PG</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Potentia Gym</div>
                        <div className="text-white/70 text-xs">online</div>
                      </div>
                    </div>
                    
                    {/* Chat */}
                    <div className="bg-[#ECE5DD] p-3 min-h-[320px]">
                      <div className="bg-white rounded-lg p-3 shadow-sm max-w-[90%] ml-auto">
                        <p className="text-gray-900 text-sm leading-relaxed">
                          Hey Lisa! Super dat je je hebt aangemeld voor een proefles bij Potentia Gym!
                        </p>
                        <p className="text-gray-900 text-sm leading-relaxed mt-2">
                          Je proefles staat gepland voor <strong>woensdag 15 jan om 19:00</strong>.
                        </p>
                        <p className="text-gray-900 text-sm leading-relaxed mt-2">
                          Westerstraat 42, Rotterdam<br/>
                          Gratis parkeren achter het gebouw
                        </p>
                        <p className="text-gray-900 text-sm leading-relaxed mt-2">
                          Heb je nog vragen? Stuur gerust een berichtje!
                        </p>
                        <div className="text-gray-400 text-xs mt-2 text-right">14:32 ✓✓</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating gym image */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-xl overflow-hidden shadow-lg hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop" 
                  alt="Gym interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Win-back */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-last lg:order-first">
              {/* Flow visualization */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Opzegging gedetecteerd</div>
                      <div className="text-gray-400 text-sm">Reden: "Te duur"</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Gepersonaliseerd template</div>
                      <div className="text-gray-400 text-sm">Win-back: prijsgevoelig</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Lid behouden!</div>
                      <div className="text-gray-400 text-sm">Daluren abonnement geaccepteerd</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-orange-400 font-medium">Win-back automation</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white leading-tight">
                Elke opzegreden, eigen aanpak.
              </h2>
              <p className="mt-6 text-gray-400 leading-relaxed">
                "Te duur" krijgt een ander bericht dan "geen tijd" of "verhuizing". 
                26 verschillende opzegreasons, 26 gepersonaliseerde win-back flows.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Een standaard email heeft 5% win-back rate.
                WhatsApp met de juiste boodschap? Tot 37%.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="text-3xl font-bold text-orange-400">37%</div>
                <div className="text-sm text-gray-500">win-back rate<br/>vs 5% bij email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats comparison */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              WhatsApp vs Email
            </h2>
            <p className="mt-4 text-gray-600">De cijfers spreken voor zich.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-gray-500 font-medium mb-6">Email marketing</div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Open rate</span>
                    <span className="font-semibold text-gray-900">20%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Click-through</span>
                    <span className="font-semibold text-gray-900">2-5%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WhatsApp */}
            <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <span className="text-purple-600 font-medium">WhatsApp</span>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-medium">WINNER</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Open rate</span>
                    <span className="font-semibold text-purple-600">98%</span>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Click-through</span>
                    <span className="font-semibold text-purple-600">45-60%</span>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gym image section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&h=800&fit=crop"
          alt="Gym atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white max-w-lg">
              Meer omzet, meer tijd, minder stress.
            </h2>
            <p className="mt-4 text-gray-300 max-w-md">
              Focus op je leden. Laat ons de communicatie automatiseren.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <blockquote className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed">
              "Onze show-up rate is van 60% naar 85% gegaan. En we hebben al 12 opzeggers 
              teruggewonnen deze maand — dat was voorheen 0."
            </blockquote>
            
            <div className="mt-8 flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
                alt="Gym owner"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">Mark de Vries</div>
                <div className="text-gray-500 text-sm">Potentia Gym, Rotterdam</div>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-purple-600">+42%</div>
                <div className="text-gray-500 text-sm">show-up rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-gray-500 text-sm">win-backs/maand</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">€7.200</div>
                <div className="text-gray-500 text-sm">extra omzet/jaar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simpele, eerlijke pricing
            </h2>
            <p className="mt-4 text-gray-600">
              Geen verborgen kosten. Geen kosten per bericht.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Per locatie</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900">€49</span>
                  <span className="text-gray-500">/maand</span>
                </div>
              </div>
              
              <ul className="mt-8 space-y-4">
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
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/login" 
                className="mt-8 block w-full py-3 bg-purple-600 text-white rounded-lg font-medium text-center hover:bg-purple-700 transition-all"
              >
                Start 14 dagen gratis
              </Link>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Geen creditcard nodig
              </p>
            </div>
            
            {/* ROI note */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>1 behouden lid = €600/jaar extra omzet.</p>
              <p>Investering: €588/jaar → <span className="text-purple-600 font-medium">ROI: 1.020%</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Klaar om te starten?
          </h2>
          <p className="mt-4 text-gray-600">
            Met een gemiddelde churn van 40% per jaar verliest een gym met 500 leden 
            elke week 4 leden. Hoeveel had je kunnen behouden?
          </p>
          <Link 
            href="/login" 
            className="inline-block mt-8 px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            Start gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
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