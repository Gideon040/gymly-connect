import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../../../lib/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const { data: gym, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!gym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    return NextResponse.json({ gym });
  } catch (error) {
    console.error('Get gym error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const {
      name,
      email,
      status,
      gymly_api_key,
      gymly_business_id,
      twilio_account_sid,
      twilio_auth_token,
      whatsapp_number,
      test_phone,
    } = body;

    const updateData: Record<string, unknown> = {
      name,
      email,
      status,
      gymly_api_key: gymly_api_key || null,
      gymly_business_id: gymly_business_id || null,
      whatsapp_number: whatsapp_number || null,
      settings: test_phone ? { testPhone: test_phone } : {},
    };

    // Only update Twilio credentials if provided
    if (twilio_account_sid) {
      updateData.twilio_account_sid = twilio_account_sid;
    }
    if (twilio_auth_token) {
      updateData.twilio_auth_token = twilio_auth_token;
    }

    const { data: gym, error } = await supabase
      .from('gyms')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ gym });
  } catch (error) {
    console.error('Update gym error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const { error } = await supabase
      .from('gyms')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete gym error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}