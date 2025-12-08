export interface Gym {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: 'pending' | 'onboarding' | 'active' | 'paused';
  gymly_api_key: string | null;
  gymly_business_id: string | null;
  twilio_account_sid: string | null;
  twilio_auth_token: string | null;
  whatsapp_number: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  gym_id: string;
  type: 'proefles' | 'opzegging' | 'inactief_30' | 'inactief_60' | 'verjaardag';
  trigger_key: string | null;
  date_text: string;
  message_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageLog {
  id: string;
  gym_id: string;
  type: string;
  trigger_key: string | null;
  recipient_phone: string;
  recipient_name: string | null;
  status: 'sent' | 'delivered' | 'failed' | 'read';
  error_message: string | null;
  sent_at: string;
}

export interface User {
  id: string;
  gym_id: string;
  email: string;
  name: string | null;
  role: 'owner' | 'admin' | 'viewer';
  created_at: string;
}