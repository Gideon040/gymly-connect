import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client met service role key (voor API routes)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// GYM QUERIES
// ============================================

export async function getGymByGymlyBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('gymly_business_id', businessId)
    .single();

  if (error) {
    console.error('Error fetching gym:', error);
    return null;
  }

  return data;
}

export async function getGymBySlug(slug: string) {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching gym:', error);
    return null;
  }

  return data;
}

export async function getGymById(gymId: string) {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('id', gymId)
    .single();

  if (error) {
    console.error('Error fetching gym:', error);
    return null;
  }

  return data;
}

export async function getAllActiveGyms() {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching gyms:', error);
    return [];
  }

  return data || [];
}

export async function getAllGyms() {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gyms:', error);
    return [];
  }

  return data || [];
}

// ============================================
// MESSAGE TEMPLATE QUERIES
// ============================================

export async function getMessageTemplate(gymId: string, type: string, triggerKey?: string) {
  let query = supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .eq('type', type)
    .eq('is_active', true);

  if (triggerKey) {
    query = query.eq('trigger_key', triggerKey);
  }

  const { data, error } = await query.single();

  if (error) {
    // Probeer fallback template zonder trigger_key
    if (triggerKey) {
      return getMessageTemplate(gymId, type);
    }
    console.error('Error fetching template:', error);
    return null;
  }

  return data;
}

export async function getAllTemplates(gymId: string) {
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .order('type', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

export async function getActiveTemplates(gymId: string) {
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('type', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

export async function updateTemplate(templateId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('message_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    return null;
  }

  return data;
}

export async function createTemplate(template: Record<string, any>) {
  const { data, error } = await supabase
    .from('message_templates')
    .insert(template)
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    return null;
  }

  return data;
}

// ============================================
// MESSAGE LOG QUERIES
// ============================================

export async function logMessage(
  gymId: string,
  type: string,
  phoneNumber: string,
  recipientName?: string,
  triggerKey?: string,
  status: string = 'sent',
  errorMessage?: string
) {
  const { error } = await supabase.from('message_logs').insert({
    gym_id: gymId,
    type,
    recipient_phone: phoneNumber,
    recipient_name: recipientName,
    trigger_key: triggerKey,
    status,
    error_message: errorMessage,
  });

  if (error) {
    console.error('Error logging message:', error);
  }
}

export async function hasMessageBeenSent(
  gymId: string,
  type: string,
  phoneNumber: string,
  withinDays: number = 30
): Promise<boolean> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - withinDays);

  const { data, error } = await supabase
    .from('message_logs')
    .select('id')
    .eq('gym_id', gymId)
    .eq('type', type)
    .eq('recipient_phone', phoneNumber)
    .eq('status', 'sent')
    .gte('sent_at', cutoffDate.toISOString())
    .limit(1);

  if (error) {
    console.error('Error checking message history:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

export async function getRecentLogs(gymId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('message_logs')
    .select('*')
    .eq('gym_id', gymId)
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data || [];
}

export async function getLogsByType(gymId: string, type: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('message_logs')
    .select('*')
    .eq('gym_id', gymId)
    .eq('type', type)
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data || [];
}

export async function getLogsByDateRange(gymId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('message_logs')
    .select('*')
    .eq('gym_id', gymId)
    .gte('sent_at', startDate.toISOString())
    .lte('sent_at', endDate.toISOString())
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data || [];
}

// ============================================
// STATS QUERIES
// ============================================

export async function getMessageStats(gymId: string) {
  // Total messages
  const { count: total } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId);

  // Delivered messages
  const { count: delivered } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId)
    .eq('status', 'delivered');

  // Failed messages
  const { count: failed } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId)
    .eq('status', 'failed');

  // This month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: thisMonth } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId)
    .gte('sent_at', startOfMonth.toISOString());

  // By type
  const { data: byTypeData } = await supabase
    .from('message_logs')
    .select('type')
    .eq('gym_id', gymId);

  const byType: Record<string, number> = {};
  byTypeData?.forEach(row => {
    byType[row.type] = (byType[row.type] || 0) + 1;
  });

  // By status
  const { data: byStatusData } = await supabase
    .from('message_logs')
    .select('status')
    .eq('gym_id', gymId);

  const byStatus: Record<string, number> = {};
  byStatusData?.forEach(row => {
    byStatus[row.status] = (byStatus[row.status] || 0) + 1;
  });

  return {
    total: total || 0,
    delivered: delivered || 0,
    failed: failed || 0,
    thisMonth: thisMonth || 0,
    deliveryRate: total ? Math.round(((delivered || 0) / total) * 100) : 0,
    byType,
    byStatus,
  };
}

export async function getDailyStats(gymId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('message_logs')
    .select('sent_at, type, status')
    .eq('gym_id', gymId)
    .gte('sent_at', startDate.toISOString())
    .order('sent_at', { ascending: true });

  if (error) {
    console.error('Error fetching daily stats:', error);
    return [];
  }

  // Group by date
  const dailyMap: Record<string, { date: string; total: number; sent: number; failed: number }> = {};
  
  data?.forEach(row => {
    const date = new Date(row.sent_at).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { date, total: 0, sent: 0, failed: 0 };
    }
    dailyMap[date].total++;
    if (row.status === 'sent' || row.status === 'delivered') {
      dailyMap[date].sent++;
    } else {
      dailyMap[date].failed++;
    }
  });

  return Object.values(dailyMap);
}