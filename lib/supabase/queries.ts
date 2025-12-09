import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client met service role key (voor API routes)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// === GYM QUERIES ===

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

// === MESSAGE TEMPLATE QUERIES ===

export async function getMessageTemplate(gymId: string, type: string, triggerKey?: string) {
  let query = supabase
    .from('message_templates')
    .select('*')
    .eq('gym_id', gymId)
    .eq('type', type)
    .eq('is_active', true);  // ✅ Fixed: was 'active'

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
    .eq('is_active', true);  // ✅ Fixed: was 'active'

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

// === MESSAGE LOG QUERIES ===

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
    recipient_phone: phoneNumber,      // ✅ Fixed: was phone_number
    recipient_name: recipientName,
    trigger_key: triggerKey,
    status,
    error_message: errorMessage,
    // sent_at is automatic via DEFAULT now()
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
    .eq('recipient_phone', phoneNumber)  // ✅ Fixed: was phone_number
    .eq('status', 'sent')
    .gte('sent_at', cutoffDate.toISOString())  // ✅ Fixed: was created_at
    .limit(1);

  if (error) {
    console.error('Error checking message history:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

// === STATS QUERIES ===

export async function getMessageStats(gymId: string) {
  // Total messages
  const { count: total } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId);

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

  // This month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: thisMonth } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId)
    .gte('sent_at', startOfMonth.toISOString());  // ✅ Fixed: was created_at

  return {
    total: total || 0,
    thisMonth: thisMonth || 0,
    byType,
    byStatus,
  };
}