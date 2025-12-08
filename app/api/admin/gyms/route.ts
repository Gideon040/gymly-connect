import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/client';

export async function GET() {
  const supabase = createServerClient();

  try {
    const { data: gyms, error } = await supabase
      .from('gyms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ gyms });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { name, email, slug, gymly_api_key, gymly_business_id, twilio_account_sid, twilio_auth_token, whatsapp_number, test_phone } = body;

    if (!name || !email || !slug) {
      return NextResponse.json({ error: 'Name, email en slug zijn verplicht' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('gyms')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slug bestaat al' }, { status: 400 });
    }

    const { data: gym, error } = await supabase
      .from('gyms')
      .insert({
        name,
        email,
        slug,
        status: 'pending',
        gymly_api_key: gymly_api_key || null,
        gymly_business_id: gymly_business_id || null,
        twilio_account_sid: twilio_account_sid || null,
        twilio_auth_token: twilio_auth_token || null,
        whatsapp_number: whatsapp_number || null,
        settings: test_phone ? { testPhone: test_phone } : {},
      })
      .select()
      .single();

    if (error) throw error;

    // Default templates
    const templates = [
      { type: 'proefles', trigger_key: null, date_text: 'deze week', message_text: `${name} - we kijken ernaar uit je te ontmoeten!` },
      { type: 'inactief_30', trigger_key: null, date_text: 'alweer 30 dagen', message_text: 'We missen je! Kom je snel weer trainen?' },
      { type: 'inactief_60', trigger_key: null, date_text: 'al 60 dagen', message_text: 'Lang niet gezien!' },
      { type: 'verjaardag', trigger_key: null, date_text: 'vandaag jarig', message_text: '🎉 Gefeliciteerd met je verjaardag!' },
      { type: 'opzegging', trigger_key: 'OTHER', date_text: 'binnenkort', message_text: 'We vinden het jammer dat je weggaat.' },
    ];

    for (const t of templates) {
      await supabase.from('message_templates').insert({ gym_id: gym.id, ...t });
    }

    return NextResponse.json({ gym });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}