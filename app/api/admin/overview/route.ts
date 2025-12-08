import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/client';

export async function GET() {
  const supabase = createServerClient();

  try {
    const { data: gyms } = await supabase
      .from('gyms')
      .select('*')
      .order('created_at', { ascending: false });

    const { count: totalMessages } = await supabase
      .from('message_logs')
      .select('*', { count: 'exact', head: true });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: messagesThisMonth } = await supabase
      .from('message_logs')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', startOfMonth.toISOString());

    return NextResponse.json({
      stats: {
        totalGyms: gyms?.length || 0,
        activeGyms: gyms?.filter(g => g.status === 'active').length || 0,
        totalMessages: totalMessages || 0,
        messagesThisMonth: messagesThisMonth || 0,
      },
      recentGyms: gyms?.slice(0, 5) || [],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}