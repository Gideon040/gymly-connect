import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';
import { getGymByGymlyBusinessId, getMessageTemplate, logMessage } from '../../../../lib/supabase/queries';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, businessId, data } = body;

    console.log(`📥 Received webhook: ${eventType} for business ${businessId}`);

    // Dynamisch: haal gym op basis van Gymly businessId
    const gym = await getGymByGymlyBusinessId(businessId);
    if (!gym) {
      console.log(`❌ No gym found for businessId: ${businessId}`);
      return NextResponse.json({ error: 'Gym not found', businessId }, { status: 404 });
    }

    console.log(`✅ Found gym: ${gym.name}`);

    // === PROEFLES ===
    if (eventType === 'BusinessLeadCreated') {
      const { lead } = data;
      const phoneNumber = lead.phoneNumber;

      if (!phoneNumber) {
        return NextResponse.json({ error: 'No phone number' }, { status: 400 });
      }

      const template = await getMessageTemplate(gym.id, 'proefles');
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      try {
        await sendTemplateMessage({
          to: phoneNumber,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': template.date_text,
            '2': template.message_text,
          },
        });

        await logMessage(gym.id, 'proefles', phoneNumber, lead.firstName);
        console.log(`✅ Sent proefles message to ${lead.firstName}`);
        
        return NextResponse.json({ success: true, gym: gym.name, type: 'proefles' });
      } catch (error) {
        await logMessage(gym.id, 'proefles', phoneNumber, lead.firstName, undefined, 'failed', String(error));
        throw error;
      }
    }

    // === OPZEGGING ===
    if (eventType === 'BusinessMembershipCancelled') {
      const { user, cancellationReason } = data;
      const phoneNumber = user.phoneNumber;

      if (!phoneNumber) {
        return NextResponse.json({ error: 'No phone number' }, { status: 400 });
      }

      // Haal specifieke template, fallback naar OTHER
      let template = await getMessageTemplate(gym.id, 'opzegging', cancellationReason);
      if (!template) {
        template = await getMessageTemplate(gym.id, 'opzegging', 'OTHER');
      }
      
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      try {
        await sendTemplateMessage({
          to: phoneNumber,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': template.date_text,
            '2': template.message_text,
          },
        });

        await logMessage(gym.id, 'opzegging', phoneNumber, user.firstName, cancellationReason);
        console.log(`✅ Sent opzegging message to ${user.firstName} (${cancellationReason})`);
        
        return NextResponse.json({ 
          success: true, 
          gym: gym.name, 
          type: 'opzegging', 
          reason: cancellationReason 
        });
      } catch (error) {
        await logMessage(gym.id, 'opzegging', phoneNumber, user.firstName, cancellationReason, 'failed', String(error));
        throw error;
      }
    }

    return NextResponse.json({ received: true, eventType, gym: gym.name });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}