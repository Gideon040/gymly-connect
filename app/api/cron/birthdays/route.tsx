import { NextResponse } from 'next/server';
import { getAllActiveMembers } from '../../../../lib/gymly/client';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

const BIRTHDAY_MESSAGE = {
  date: 'vandaag jarig',
  message: '🎉 Gefeliciteerd met je verjaardag! Kom langs voor een feestelijke workout - je eerste drankje is van ons!',
};

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🎂 Starting birthday check...');

    const allMembers = await getAllActiveMembers();
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Filter leden die vandaag jarig zijn
    const birthdayMembers = allMembers.filter(user => {
      if (!user.dateOfBirth || !user.phoneNumber) return false;
      const dob = new Date(user.dateOfBirth);
      return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
    });

    console.log(`🎂 Birthdays today: ${birthdayMembers.length}`);

    const results = {
      checked: allMembers.length,
      birthdays: birthdayMembers.length,
      messagesSent: 0,
      errors: [] as string[],
    };

    for (const user of birthdayMembers) {
      try {
        await sendTemplateMessage({
          to: user.phoneNumber!,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          variables: {
            '1': BIRTHDAY_MESSAGE.date,
            '2': BIRTHDAY_MESSAGE.message,
          },
        });
        results.messagesSent++;
        console.log(`🎂 Sent birthday message to ${user.firstName}`);
      } catch (error) {
        results.errors.push(`Failed to send to ${user.id}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Birthday cron error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}