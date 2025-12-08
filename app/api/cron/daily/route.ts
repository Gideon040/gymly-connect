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

  const debug = {
    totalMembers: 0,
    membersWithPhone: 0,
    membersWithLastCheckin: 0,
    membersWithBirthday: 0,
    sampleMembers: [] as object[],
    birthdayMembers: [] as object[],
    inactive30Members: [] as object[],
    inactive60Members: [] as object[],
  };

  try {
    console.log('🔄 Starting daily automation check...');

    const allMembers = await getAllActiveMembers();
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // === DEBUG INFO ===
    debug.totalMembers = allMembers.length;
    debug.membersWithPhone = allMembers.filter(u => u.phoneNumber).length;
    debug.membersWithLastCheckin = allMembers.filter(u => u.lastCheckinAt).length;
    debug.membersWithBirthday = allMembers.filter(u => u.dateOfBirth).length;

    // Sample van eerste 3 leden
    debug.sampleMembers = allMembers.slice(0, 3).map(u => ({
      id: u.id,
      firstName: u.firstName,
      phoneNumber: u.phoneNumber ? '✅ Ja' : '❌ Nee',
      lastCheckinAt: u.lastCheckinAt || '❌ Geen data',
      dateOfBirth: u.dateOfBirth || '❌ Geen data',
      daysSinceCheckin: u.lastCheckinAt 
        ? Math.floor((Date.now() - new Date(u.lastCheckinAt).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }));

    console.log(`📊 Total members: ${allMembers.length}`);
    console.log(`📱 With phone: ${debug.membersWithPhone}`);
    console.log(`📅 With lastCheckin: ${debug.membersWithLastCheckin}`);
    console.log(`🎂 With birthday: ${debug.membersWithBirthday}`);

    // === VERJAARDAGEN ===
    const birthdayMembers = allMembers.filter(user => {
      if (!user.dateOfBirth || !user.phoneNumber) return false;
      const dob = new Date(user.dateOfBirth);
      return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
    });

    results.birthdays.found = birthdayMembers.length;
    debug.birthdayMembers = birthdayMembers.map(u => ({
      firstName: u.firstName,
      dateOfBirth: u.dateOfBirth,
      phoneNumber: u.phoneNumber?.slice(-4), // Laatste 4 cijfers
    }));

    console.log(`🎂 Birthdays today (${todayDay}-${todayMonth}): ${birthdayMembers.length}`);

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
        results.errors.push(`Birthday ${user.firstName}: ${error}`);
      }
    }

    // === INACTIEVE LEDEN ===
    const inactive60 = getInactiveMembers(allMembers, 60);
    const inactive30 = getInactiveMembers(allMembers, 30).filter(
      user => !inactive60.find(u => u.id === user.id)
    );

    results.inactive30.found = inactive30.length;
    results.inactive60.found = inactive60.length;

    debug.inactive30Members = inactive30.slice(0, 5).map(u => ({
      firstName: u.firstName,
      lastCheckinAt: u.lastCheckinAt,
      daysSinceCheckin: Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24)),
      phoneNumber: u.phoneNumber?.slice(-4),
    }));

    debug.inactive60Members = inactive60.slice(0, 5).map(u => ({
      firstName: u.firstName,
      lastCheckinAt: u.lastCheckinAt,
      daysSinceCheckin: Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24)),
      phoneNumber: u.phoneNumber?.slice(-4),
    }));

    console.log(`😴 30 days inactive: ${inactive30.length}`);
    console.log(`😴😴 60 days inactive: ${inactive60.length}`);

    // 60 dagen
    for (const user of inactive60) {
      const lastSent = sentMessages.get(`inactive-${user.id}`);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) {
        console.log(`⏭️ Skipping ${user.firstName} - already sent within 7 days`);
        continue;
      }

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
        console.log(`✅ Sent 60-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Inactive60 ${user.firstName}: ${error}`);
      }
    }

    // 30 dagen
    for (const user of inactive30) {
      const lastSent = sentMessages.get(`inactive-${user.id}`);
      if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) {
        console.log(`⏭️ Skipping ${user.firstName} - already sent within 7 days`);
        continue;
      }

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
        console.log(`✅ Sent 30-day message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Inactive30 ${user.firstName}: ${error}`);
      }
    }

    console.log('✅ Daily automation complete');

    return NextResponse.json({
      success: true,
      debug,
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Daily cron error:', error);
    return NextResponse.json(
      { success: false, error: String(error), debug },
      { status: 500 }
    );
  }
}