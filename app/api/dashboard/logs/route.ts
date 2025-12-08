import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/client';
import { getGymBySlug } from '../../../../lib/supabase/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gymSlug = searchParams.get('gym') || 'potentia-gym';

  const gym = await getGymBySlug(gymSlug);
  if (!gym) {
    return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
  }

  const supabase = createServerClient();

  const { data: logs, error } = await supabase
    .from('message_logs')
    .select('*')
    .eq('gym_id', gym.id)
    .order('sent_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }

  return NextResponse.json({ logs });
}