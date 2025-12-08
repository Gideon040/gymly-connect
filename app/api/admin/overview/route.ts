import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/client';

export async function GET() {
  const supabase = createServerClient();

  try {
    // Get all gyms
    const { data: gyms, error: gymsError } = await supabase
      .from('gyms')
      .select('*')
      .order('created_at', { ascending: false });

    if (gymsError) throw gymsError;

    // Get message count
    const { count: totalMessages } = await supabase
      .from('message_logs')
      .select('*', { count: 'exact', head: true });

    // Get messages this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: messagesThisMonth } = await supabase
      .from('message_logs')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', startOfMonth.toISOString());

    const stats = {
      totalGyms: gyms?.length || 0,
      activeGyms: gyms?.filter(g => g.status === 'active').length || 0,
      totalMessages: totalMessages || 0,
      messagesThisMonth: messagesThisMonth || 0,
    };

    return NextResponse.json({
      stats,
      recentGyms: gyms?.slice(0, 5) || [],
    });
  } catch (error) {
    console.error('Overview error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}