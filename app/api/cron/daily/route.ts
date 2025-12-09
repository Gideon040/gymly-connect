import { NextResponse } from 'next/server';
import { getAllActiveMembers, getInactiveMembers, getBirthdayMembers } from '../../../../lib/gymly/client';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';
import { getAllActiveGyms, getMessageTemplate, logMessage, hasMessageBeenSent } from '../../../../lib/supabase/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debugMode = searchParams.get('debug') === 'true';
  const gymSlug = searchParams.get('gym');

  // Auth check (skip in debug mode)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && !debugMode) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: any[] = [];

  try {
    // Haal alle actieve gyms op
    const gyms = await getAllActiveGyms();
    console.log(`🏋️ Processing ${gyms.length} active gyms`);

    for (const gym of gyms) {
      // Filter op specifieke gym indien gevraagd
      if (gymSlug && gym.slug !== gymSlug) {
        continue;
      }

      console.log(`\n📍 Processing gym: ${gym.name}`);
      
      // Skip als geen Gymly credentials
      if (!gym.gymly_api_key || !gym.gymly_business_id) {
        console.log(`⏭️ Skipping ${gym.name}: no Gymly credentials`);
        results.push({ gym: gym.name, skipped: true, reason: 'No Gymly credentials' });
        continue;
      }

      // Skip als geen Twilio credentials
      if (!gym.twilio_account_sid || !gym.whatsapp_number) {
        console.log(`⏭️ Skipping ${gym.name}: no Twilio credentials`);
        results.push({ gym: gym.name, skipped: true, reason: 'No Twilio credentials' });
        continue;
      }

      try {
        // Haal alle actieve leden op via Gymly API
        const members = await getAllActiveMembers(gym);
        
        // === INACTIEVE LEDEN (30 dagen) ===
        const inactive30 = getInactiveMembers(members, 30);
        const inactive30Sent: string[] = [];

        for (const user of inactive30) {
          // Check of we al een bericht hebben gestuurd (binnen 30 dagen)
          const alreadySent = await hasMessageBeenSent(gym.id, 'inactief_30', user.phoneNumber!, 30);
          if (alreadySent) continue;

          const template = await getMessageTemplate(gym.id, 'inactief_30');
          if (!template) continue;

          try {
            await sendTemplateMessage({
              to: user.phoneNumber!,
              contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
              variables: {
                '1': template.date_text,
                '2': template.message_text,
              },
              gym,
            });

            await logMessage(gym.id, 'inactief_30', user.phoneNumber!, user.firstName);
            inactive30Sent.push(user.firstName);
          } catch (err) {
            console.error(`❌ Failed to send to ${user.firstName}:`, err);
            await logMessage(gym.id, 'inactief_30', user.phoneNumber!, user.firstName, undefined, 'failed', String(err));
          }
        }

        // === INACTIEVE LEDEN (60 dagen) ===
        const inactive60 = getInactiveMembers(members, 60);
        const inactive60Sent: string[] = [];

        for (const user of inactive60) {
          const alreadySent = await hasMessageBeenSent(gym.id, 'inactief_60', user.phoneNumber!, 30);
          if (alreadySent) continue;

          const template = await getMessageTemplate(gym.id, 'inactief_60');
          if (!template) continue;

          try {
            await sendTemplateMessage({
              to: user.phoneNumber!,
              contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
              variables: {
                '1': template.date_text,
                '2': template.message_text,
              },
              gym,
            });

            await logMessage(gym.id, 'inactief_60', user.phoneNumber!, user.firstName);
            inactive60Sent.push(user.firstName);
          } catch (err) {
            console.error(`❌ Failed to send to ${user.firstName}:`, err);
            await logMessage(gym.id, 'inactief_60', user.phoneNumber!, user.firstName, undefined, 'failed', String(err));
          }
        }

        // === VERJAARDAGEN ===
        const birthdays = getBirthdayMembers(members);
        const birthdaysSent: string[] = [];

        for (const user of birthdays) {
          // Check of we al felicitatie hebben gestuurd (binnen 365 dagen)
          const alreadySent = await hasMessageBeenSent(gym.id, 'verjaardag', user.phoneNumber!, 365);
          if (alreadySent) continue;

          const template = await getMessageTemplate(gym.id, 'verjaardag');
          if (!template) continue;

          try {
            await sendTemplateMessage({
              to: user.phoneNumber!,
              contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
              variables: {
                '1': template.date_text,
                '2': template.message_text,
              },
              gym,
            });

            await logMessage(gym.id, 'verjaardag', user.phoneNumber!, user.firstName);
            birthdaysSent.push(user.firstName);
          } catch (err) {
            console.error(`❌ Failed to send birthday to ${user.firstName}:`, err);
            await logMessage(gym.id, 'verjaardag', user.phoneNumber!, user.firstName, undefined, 'failed', String(err));
          }
        }

        results.push({
          gym: gym.name,
          totalMembers: members.length,
          inactive30: { found: inactive30.length, sent: inactive30Sent.length, names: debugMode ? inactive30Sent : undefined },
          inactive60: { found: inactive60.length, sent: inactive60Sent.length, names: debugMode ? inactive60Sent : undefined },
          birthdays: { found: birthdays.length, sent: birthdaysSent.length, names: debugMode ? birthdaysSent : undefined },
        });

        console.log(`✅ ${gym.name}: ${inactive30Sent.length} inactive30, ${inactive60Sent.length} inactive60, ${birthdaysSent.length} birthdays sent`);

      } catch (gymError) {
        console.error(`❌ Error processing ${gym.name}:`, gymError);
        results.push({ gym: gym.name, error: String(gymError) });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processedAt: new Date().toISOString(),
      results 
    });

  } catch (error) {
    console.error('❌ Daily cron error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}