import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gymId = searchParams.get('gym');
  const limit = parseInt(searchParams.get('limit') || '100');

  const supabase = createServerClient();

  try {
    let query = supabase
      .from('message_logs')
      .select(`
        *,
        gyms (name, slug)
      `)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (gymId) {
      query = query.eq('gym_id', gymId);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}