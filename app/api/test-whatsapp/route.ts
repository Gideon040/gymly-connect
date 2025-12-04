import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../lib/whatsapp/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Appointment reminder template (sandbox pre-approved)
    const result = await sendTemplateMessage({
      to: phoneNumber,
      contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Appointment reminder
      variables: {
        '1': 'morgen',      // datum
        '2': '14:00',       // tijd
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: result 
    });
  } catch (error) {
    console.error('WhatsApp error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}