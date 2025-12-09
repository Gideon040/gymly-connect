import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';
import { getMessageTemplate, logMessage } from '../../../../lib/supabase/queries';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { gymId, type, phoneNumber, recipientName, triggerKey } = await request.json();

    // Validatie
    if (!gymId || !type || !phoneNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields: gymId, type, phoneNumber' 
      }, { status: 400 });
    }

    // Haal gym op
    const { data: gym, error: gymError } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
      .single();

    if (gymError || !gym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    // Check Twilio credentials
    if (!gym.twilio_account_sid || !gym.twilio_auth_token || !gym.whatsapp_number) {
      return NextResponse.json({ 
        error: 'Twilio credentials niet ingesteld',
        missing: {
          account_sid: !gym.twilio_account_sid,
          auth_token: !gym.twilio_auth_token,
          whatsapp_number: !gym.whatsapp_number
        }
      }, { status: 400 });
    }

    // Haal template op
    const template = await getMessageTemplate(gym.id, type, triggerKey);
    if (!template) {
      return NextResponse.json({ 
        error: `Template niet gevonden voor type: ${type}` 
      }, { status: 404 });
    }

    // Stuur bericht
    try {
      const message = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        variables: {
          '1': template.date_text,
          '2': template.message_text,
        },
        gym,
      });

      // Log het bericht
      await logMessage(gym.id, type, phoneNumber, recipientName, triggerKey);

      return NextResponse.json({
        success: true,
        messageSid: message.sid,
        to: phoneNumber,
        type,
        template: {
          date_text: template.date_text,
          message_text: template.message_text
        }
      });

    } catch (sendError: any) {
      // Log de fout
      await logMessage(gym.id, type, phoneNumber, recipientName, triggerKey, 'failed', String(sendError));
      
      return NextResponse.json({
        success: false,
        error: sendError.message || String(sendError),
        code: sendError.code,
        moreInfo: sendError.moreInfo
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Send API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}