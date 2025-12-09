import { NextResponse } from 'next/server';
import { getGymBySlug, getAllTemplates } from '../../../lib/supabase/queries';

export async function GET() {
  try {
    const gym = await getGymBySlug('potentia-gym');
    
    if (!gym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }
    
    const templates = await getAllTemplates(gym.id);
    
    return NextResponse.json({
      success: true,
      gym: {
        id: gym.id,
        name: gym.name,
        status: gym.status,
      },
      templates: templates.map(t => ({
        type: t.type,
        trigger_key: t.trigger_key,
        date_text: t.date_text,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}