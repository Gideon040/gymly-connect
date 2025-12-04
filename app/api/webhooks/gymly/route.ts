import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

// Gymly webhook handler
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log voor debugging
    console.log('📥 Gymly webhook received:', JSON.stringify(payload, null, 2));

    const { eventType, data, businessId } = payload;

    // Nieuwe lead aangemaakt (proefles aanmelding)
    if (eventType === 'BusinessLeadCreated') {
      const { lead } = data;
      const phoneNumber = lead.phoneNumber;
      const firstName = lead.firstName;

      if (!phoneNumber) {
        console.log('⚠️ No phone number for lead:', lead.id);
        return NextResponse.json({ success: true, skipped: 'no phone number' });
      }

      console.log(`📱 Sending WhatsApp to ${firstName} (${phoneNumber})`);

      // Verstuur welkomst/bevestigingsbericht
      // TODO: Later eigen template maken, nu sandbox appointment reminder
      const result = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Sandbox template
        variables: {
          '1': 'binnenkort',  // datum placeholder
          '2': 'je proefles', // tijd placeholder  
        },
      });

      console.log('✅ WhatsApp sent:', result);

      return NextResponse.json({ 
        success: true, 
        eventType,
        messageSid: result.sid 
      });
    }

    // Andere events (later uitbreiden)
    if (eventType === 'BusinessMembershipCancelled') {
      console.log('👋 Membership cancelled:', data);
      // TODO: Heractivatie flow
    }

    return NextResponse.json({ success: true, eventType, processed: false });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Gymly might send GET to verify endpoint
export async function GET() {
  return NextResponse.json({ status: 'Gymly webhook endpoint active' });
}