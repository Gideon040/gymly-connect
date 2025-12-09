import { NextResponse } from 'next/server';
import { getGymBySlug, getMessageStats, getRecentLogs } from '../../../lib/supabase/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gymSlug = searchParams.get('gym') || 'potentia-gym';
  const days = parseInt(searchParams.get('days') || '30');

  const gym = await getGymBySlug(gymSlug);
  if (!gym) {
    return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
  }

  const stats = await getMessageStats(gym.id, );
  const recentLogs = await getRecentLogs(gym.id, 20);
  
  return NextResponse.json({ 
    gym: { id: gym.id, name: gym.name },
    period: `${days} dagen`,
    stats,
    recentLogs: recentLogs.map(log => ({
      type: log.type,
      recipient: log.recipient_name || log.recipient_phone.slice(-4),
      status: log.status,
      sentAt: log.sent_at,
    })),
  });
}