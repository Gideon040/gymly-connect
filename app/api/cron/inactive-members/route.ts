import { NextResponse } from 'next/server';
import { getAllActiveMembers, getInactiveMembers } from '../../../../lib/gymly/client';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

// Berichten per inactiviteit niveau
const INACTIVE_MESSAGES = {
  30: {
    date: 'alweer 30 dagen',
    message: 'We missen je! Kom je snel weer trainen? Je eerste workout terug is altijd de moeilijkste 💪',
  },
  60: {
    date: 'al 60 dagen',
    message: 'Lang niet gezien! We hebben je plek warm gehouden. Zullen we een afspraak maken om je weer op weg te helpen?',
  },
};

// Simple in-memory tracking (voor productie: gebruik database)
const sentMessages = new Map<string, number>(); // oderId -> timestamp

export async function GET(request: Request) {
  // Verify cron secret (security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Starting inactive members check...');

    // Haal alle actieve leden op
    const allMembers = await getAllActiveMembers();
    console.log(`📊 Total active members: ${allMembers.length}`);

    // Filter op 60 dagen inactief (meest urgent eerst)
    const inactive60 = getInactiveMembers(allMembers, 60);
    const inactive30 = getInactiveMembers(allMembers, 30).filter(
      user => !inactive60.find(u => u.id === user.id) // Exclude 60-day users
    );

    console.log(`😴 30 days inactive: ${inactive30.length}`);
    console.log(`😴😴 60 days inactive: ${inactive60.length}`);

    const results = {
      checked: allMembers.length,
      inactive30: inactive30.length,
      inactive60: inactive60.length,
      messagesSent: 0,
      errors: [] as string[],
    };

    // Verstuur 60-dagen berichten
    for (const user of inactive60) {
      // Check of we recent al een bericht hebben gestuurd (binnen 7 dagen)
      const lastSent = sentMessages.get(user.id);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) {
        continue; // Skip - recent al bericht gehad
      }

      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': INACTIVE_MESSAGES[60].date,
            '2': INACTIVE_MESSAGES[60].message,
          },
        });
        sentMessages.set(user.id, Date.now());
        results.messagesSent++;
        console.log(`✅ Sent 60-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Failed to send to ${user.id}: ${error}`);
      }
    }

    // Verstuur 30-dagen berichten
    for (const user of inactive30) {
      const lastSent = sentMessages.get(user.id);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) {
        continue;
      }

      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': INACTIVE_MESSAGES[30].date,
            '2': INACTIVE_MESSAGES[30].message,
          },
        });
        sentMessages.set(user.id, Date.now());
        results.messagesSent++;
        console.log(`✅ Sent 30-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Failed to send to ${user.id}: ${error}`);
      }
    }

    console.log(`📨 Total messages sent: ${results.messagesSent}`);

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Cron error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}