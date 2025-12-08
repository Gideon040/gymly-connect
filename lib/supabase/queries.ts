import { createServerClient } from './client';
import type { Gym, MessageTemplate, MessageLog } from './types';

// === GYMS ===
export async function getGymBySlug(slug: string): Promise<Gym | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) return null;
  return data;
}

export async function getGymById(id: string): Promise<Gym | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function getGymByGymlyBusinessId(businessId: string): Promise<Gym | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('gymly_business_id', businessId)
    .single();
  
  if (error) return null;
  return data;
}

export async function getAllActiveGyms(): Promise<Gym[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('status', 'active');
  
  if (error) return [];
  return data;
}

// === MESSAGE TEMPLATES ===
export async function getMessageTemplates(gymId: string): Promise<MessageTemplate[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .eq('is_active', true);
  
  if (error) return [];
  return data;
}

export async function getMessageTemplate(
  gymId: string, 
  type: string, 
  triggerKey?: string
): Promise<MessageTemplate | null> {
  const supabase = createServerClient();
  let query = supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .eq('type', type)
    .eq('is_active', true);
  
  if (triggerKey) {
    query = query.eq('trigger_key', triggerKey);
  } else {
    query = query.is('trigger_key', null);
  }
  
  const { data, error } = await query.single();
  if (error) return null;
  return data;
}

export async function upsertMessageTemplate(
  gymId: string,
  type: string,
  dateText: string,
  messageText: string,
  triggerKey?: string
): Promise<MessageTemplate | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('message_templates')
    .upsert({
      gym_id: gymId,
      type,
      trigger_key: triggerKey || null,
      date_text: dateText,
      message_text: messageText,
    }, {
      onConflict: 'gym_id,type,trigger_key',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Upsert error:', error);
    return null;
  }
  return data;
}

// === MESSAGE LOGS ===
export async function logMessage(
  gymId: string,
  type: string,
  recipientPhone: string,
  recipientName?: string,
  triggerKey?: string,
  status: 'sent' | 'delivered' | 'failed' = 'sent',
  errorMessage?: string
): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('message_logs').insert({
    gym_id: gymId,
    type,
    trigger_key: triggerKey,
    recipient_phone: recipientPhone,
    recipient_name: recipientName,
    status,
    error_message: errorMessage,
  });
}

export async function getMessageStats(gymId: string, days: number = 30) {
  const supabase = createServerClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from('message_logs')
    .select('type, status')
    .eq('gym_id', gymId)
    .gte('sent_at', since.toISOString());
  
  if (error) return { total: 0, byType: {}, byStatus: {} };
  
  const stats = {
    total: data.length,
    byType: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
  };
  
  data.forEach(log => {
    stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
    stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
  });
  
  return stats;
}

export async function getRecentLogs(gymId: string, limit: number = 50): Promise<MessageLog[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('message_logs')
    .select('*')
    .eq('gym_id', gymId)
    .order('sent_at', { ascending: false })
    .limit(limit);
  
  if (error) return [];
  return data;
}