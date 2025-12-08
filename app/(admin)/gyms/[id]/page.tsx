'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Gym {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: string;
  gymly_api_key: string | null;
  gymly_business_id: string | null;
  twilio_account_sid: string | null;
  twilio_auth_token: string | null;
  whatsapp_number: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export default function EditGymPage() {
  const router = useRouter();
  const params = useParams();
  const gymId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    slug: '',
    status: 'pending',
    gymly_api_key: '',
    gymly_business_id: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    whatsapp_number: '',
    test_phone: '',
  });

  useEffect(() => {
    loadGym();
  }, [gymId]);

  async function loadGym() {
    try {
      const res = await fetch(`/api/admin/gyms/${gymId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gym not found');
      }

      const gym: Gym = data.gym;
      setFormData({
        name: gym.name,
        email: gym.email,
        slug: gym.slug,
        status: gym.status,
        gymly_api_key: gym.gymly_api_key || '',
        gymly_business_id: gym.gymly_business_id || '',
        twilio_account_sid: gym.twilio_account_sid || '',
        twilio_auth_token: gym.twilio_auth_token || '',
        whatsapp_number: gym.whatsapp_number || '',
        test_phone: (gym.settings?.testPhone as string) || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/gyms/${gymId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update gym');
      }

      setSuccess('Gym succesvol bijgewerkt!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je deze gym wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gyms/${gymId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete gym');
      }

      router.push('/admin/gyms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/gyms"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
            <p className="text-gray-500">{formData.slug}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          formData.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : formData.status === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {formData.status}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Basis Informatie</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="onboarding">Onboarding</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gym Naam</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Telefoonnummer</label>
              <input
                type="text"
                value={formData.test_phone}
                onChange={(e) => handleChange('test_phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+31612345678"
              />
            </div>
          </div>
        </div>

        {/* Gymly Config */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Gymly Configuratie</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gymly API Key</label>
              <input
                type="text"
                value={formData.gymly_api_key}
                onChange={(e) => handleChange('gymly_api_key', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gymly Business ID</label>
              <input
                type="text"
                value={formData.gymly_business_id}
                onChange={(e) => handleChange('gymly_business_id', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Twilio Config */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Twilio Configuratie</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Twilio Account SID</label>
              <input
                type="text"
                value={formData.twilio_account_sid}
                onChange={(e) => handleChange('twilio_account_sid', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Twilio Auth Token</label>
              <input
                type="password"
                value={formData.twilio_auth_token}
                onChange={(e) => handleChange('twilio_auth_token', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={formData.twilio_auth_token ? '••••••••••••••••' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Nummer</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-all"
          >
            Gym Verwijderen
          </button>
          <div className="flex gap-3">
            <Link
              href="/admin/gyms"
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-all"
            >
              {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}