import { NextResponse } from 'next/server';
import { getAllActiveMembers, getInactiveMembers } from '../../../../lib/gymly/client';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

const MESSAGES = {
  inactive30: {
    date: 'alweer 30 dagen',
    message: 'We missen je! Kom je snel weer trainen? Je eerste workout terug is altijd de moeilijkste 💪',
  },
  inactive60: {
    date: 'al 60 dagen',
    message: 'Lang niet gezien! We hebben je plek warm gehouden. Zullen we een afspraak maken om je weer op weg te helpen?',
  },
  birthday: {
    date: 'vandaag jarig',
    message: '🎉 Gefeliciteerd met je verjaardag! Kom langs voor een feestelijke workout - je eerste drankje is van ons!',
  },
};

const sentMessages = new Map<string, number>();

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    birthdays: { found: 0, sent: 0 },
    inactive30: { found: 0, sent: 0 },
    inactive60: { found: 0, sent: 0 },
    errors: [] as string[],
  };

  try {
    console.log('🔄 Starting daily automation check...');

    const allMembers = await getAllActiveMembers();
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // === VERJAARDAGEN ===
    const birthdayMembers = allMembers.filter(user => {
      if (!user.dateOfBirth || !user.phoneNumber) return false;
      const dob = new Date(user.dateOfBirth);
      return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
    });

    results.birthdays.found = birthdayMembers.length;
    console.log(`🎂 Birthdays today: ${birthdayMembers.length}`);

    for (const user of birthdayMembers) {
      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': MESSAGES.birthday.date,
            '2': MESSAGES.birthday.message,
          },
        });
        results.birthdays.sent++;
        console.log(`🎂 Sent birthday message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Birthday ${user.id}: ${error}`);
      }
    }

    // === INACTIEVE LEDEN ===
    const inactive60 = getInactiveMembers(allMembers, 60);
    const inactive30 = getInactiveMembers(allMembers, 30).filter(
      user => !inactive60.find(u => u.id === user.id)
    );

    results.inactive30.found = inactive30.length;
    results.inactive60.found = inactive60.length;
    console.log(`😴 30 days: ${inactive30.length}, 60 days: ${inactive60.length}`);

    // 60 dagen
    for (const user of inactive60) {
      const lastSent = sentMessages.get(`inactive-${user.id}`);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) continue;

      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': MESSAGES.inactive60.date,
            '2': MESSAGES.inactive60.message,
          },
        });
        sentMessages.set(`inactive-${user.id}`, Date.now());
        results.inactive60.sent++;
        console.log(`😴 Sent 60-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Inactive60 ${user.id}: ${error}`);
      }
    }

    // 30 dagen
    for (const user of inactive30) {
      const lastSent = sentMessages.get(`inactive-${user.id}`);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) continue;

      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': MESSAGES.inactive30.date,
            '2': MESSAGES.inactive30.message,
          },
        });
        sentMessages.set(`inactive-${user.id}`, Date.now());
        results.inactive30.sent++;
        console.log(`😴 Sent 30-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Inactive30 ${user.id}: ${error}`);
      }
    }

    console.log('✅ Daily automation complete');

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Daily cron error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}