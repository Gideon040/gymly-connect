'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegister) {
      // Registreren
      if (password !== confirmPassword) {
        setError('Wachtwoorden komen niet overeen');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Wachtwoord moet minimaal 6 tekens zijn');
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Maak direct een gym aan voor de nieuwe user
      if (authData.user) {
        const { error: gymError } = await supabase.from('gyms').insert({
          owner_id: authData.user.id,
          email: email,
          name: 'Mijn Gym',
          slug: `gym-${authData.user.id.slice(0, 8)}`,
          status: 'onboarding',
        });

        if (gymError) {
          console.error('Gym aanmaken mislukt:', gymError);
        }
      }

      setSuccess('Account aangemaakt! Je kunt nu inloggen.');
      setIsRegister(false);
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } else {
      // Inloggen
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">GymlyConnect</h1>
            <p className="text-sm text-gray-500">
              {isRegister ? 'Maak een account aan' : 'Log in om verder te gaan'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="jouw@email.nl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bevestig wachtwoord</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Laden...' : isRegister ? 'Registreren' : 'Inloggen'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isRegister ? (
              <>
                Heb je al een account?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Nog geen account?{' '}
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Registreer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}