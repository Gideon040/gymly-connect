import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

const GYMLY_API_URL = 'https://api.gymly.io';
const GYMLY_API_KEY = process.env.GYMLY_API_KEY!;
const GYMLY_BUSINESS_ID = process.env.GYMLY_BUSINESS_ID!;

const CLASS_REMINDER_MESSAGE = {
  date: 'morgen',
  message: 'Je staat ingeschreven voor een les! Vergeet niet je sportspullen mee te nemen 💪',
};

interface ActivityEvent {
  id: string;
  name: string;
  startAt: string;
  memberCount: number;
}

interface EventMember {
  id: string;
  firstName: string;
  phoneNumber?: string;
  fullName: string;
}

async function getTomorrowEvents(): Promise<ActivityEvent[]> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const response = await fetch(
    `${GYMLY_API_URL}/api/v1/businesses/${GYMLY_BUSINESS_ID}/activity-events?startDate=${dateStr}&endDate=${dateStr}`,
    {
      headers: {
        'Authorization': `ApiKey ${GYMLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gymly API error: ${response.status}`);
  }

  return response.json();
}

async function getEventMembers(eventId: string): Promise<EventMember[]> {
  const response = await fetch(
    `${GYMLY_API_URL}/api/v1/businesses/${GYMLY_BUSINESS_ID}/activity-events/${eventId}/members`,
    {
      headers: {
        'Authorization': `ApiKey ${GYMLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gymly API error: ${response.status}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📅 Starting class reminder check...');

    const tomorrowEvents = await getTomorrowEvents();
    console.log(`📅 Events tomorrow: ${tomorrowEvents.length}`);

    const results = {
      eventsChecked: tomorrowEvents.length,
      totalMembers: 0,
      messagesSent: 0,
      errors: [] as string[],
    };

    for (const event of tomorrowEvents) {
      const members = await getEventMembers(event.id);
      results.totalMembers += members.length;

      for (const member of members) {
        if (!member.phoneNumber) continue;

        try {
          const eventTime = new Date(event.startAt).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          });

          await sendTemplateMessage({
            to: member.phoneNumber,
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            variables: {
              '1': `morgen om ${eventTime}`,
              '2': `${event.name} - ${CLASS_REMINDER_MESSAGE.message}`,
            },
          });
          results.messagesSent++;
          console.log(`📅 Sent class reminder to ${member.firstName} for ${event.name}`);
        } catch (error) {
          results.errors.push(`Failed to send to ${member.id}: ${error}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Class reminder cron error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}