import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

// Config (later uit database)
const CONFIG = {
  // Proefles
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  // Opzegging
  cancelDate: 'binnenkort',
  cancelMessage: 'We vinden het jammer dat je weggaat. Mogen we vragen waarom?',
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('📥 Gymly webhook:', JSON.stringify(payload, null, 2));

    const { eventType, data } = payload;

    // === PROEFLES ===
    if (eventType === 'BusinessLeadCreated') {
      const { lead } = data;
      const phoneNumber = lead.phoneNumber;
      const firstName = lead.firstName;

      if (!phoneNumber) {
        console.log('⚠️ No phone number for lead:', lead.id);
        return NextResponse.json({ success: true, skipped: 'no phone number' });
      }

      console.log(`📱 Sending proefles WhatsApp to ${firstName} (${phoneNumber})`);

      const result = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        variables: {
          '1': CONFIG.welcomeDate,
          '2': CONFIG.welcomeMessage,
        },
      });

      console.log('✅ Proefles WhatsApp sent:', result);

      return NextResponse.json({ 
        success: true, 
        eventType,
        messageSid: result.sid 
      });
    }

    // === OPZEGGING ===
    if (eventType === 'BusinessMembershipCancelled') {
      const { user } = data;
      const phoneNumber = user?.phoneNumber;
      const firstName = user?.firstName;

      if (!phoneNumber) {
        console.log('⚠️ No phone number for cancelled member:', user?.id);
        return NextResponse.json({ success: true, skipped: 'no phone number' });
      }

      console.log(`📱 Sending cancellation WhatsApp to ${firstName} (${phoneNumber})`);

      const result = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        variables: {
          '1': CONFIG.cancelDate,
          '2': CONFIG.cancelMessage,
        },
      });

      console.log('✅ Cancellation WhatsApp sent:', result);

      return NextResponse.json({ 
        success: true, 
        eventType,
        messageSid: result.sid 
      });
    }

    // Andere events
    console.log('ℹ️ Unhandled event:', eventType);
    return NextResponse.json({ success: true, eventType, handled: false });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Gymly webhook active' });
}