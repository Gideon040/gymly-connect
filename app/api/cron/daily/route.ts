import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';
import { 
  getAllActiveGyms, 
  getMessageTemplate, 
  logMessage 
} from '../../../../lib/supabase/queries';

interface GymlyUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  lastCheckinAt: string | null;
  dateOfBirth: string | null;
}

interface GymlyUsersResponse {
  content: GymlyUser[];
  totalPages: number;
}

// Haal alle actieve leden op voor een gym
async function getAllActiveMembersForGym(apiKey: string, businessId: string): Promise<GymlyUser[]> {
  const allUsers: GymlyUser[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(
      `https://api.gymly.io/api/v2/businesses/${businessId}/users?page=${page}&size=100&active=true&type=MEMBER`,
      {
        headers: {
          'Authorization': `ApiKey ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gymly API error: ${response.status}`);
    }

    const data: GymlyUsersResponse = await response.json();
    allUsers.push(...data.content);
    totalPages = data.totalPages;
    page++;
  }

  return allUsers;
}

// Filter inactieve leden
function getInactiveMembers(users: GymlyUser[], days: number): GymlyUser[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return users.filter(user => {
    if (!user.lastCheckinAt || !user.phoneNumber) return false;
    const lastCheckin = new Date(user.lastCheckinAt);
    return lastCheckin < cutoffDate;
  });
}

// Track berichten om dubbele te voorkomen (per server instance)
const sentMessages = new Map<string, number>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debugRaw = searchParams.get('debug') === 'raw';
  const gymSlug = searchParams.get('gym'); // Optioneel: specifieke gym

  // Auth check
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Skip auth voor debug mode
    if (!debugRaw) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Haal alle actieve gyms op
    const gyms = await getAllActiveGyms();
    
    if (gyms.length === 0) {
      return NextResponse.json({ error: 'No active gyms found' }, { status: 404 });
    }

    const allResults: Record<string, unknown> = {};

    // Loop door alle gyms
    for (const gym of gyms) {
      // Skip als geen Gymly credentials
      if (!gym.gymly_api_key || !gym.gymly_business_id) {
        allResults[gym.name] = { skipped: true, reason: 'No Gymly credentials' };
        continue;
      }

      // Als specifieke gym gevraagd, skip anderen
      if (gymSlug && gym.slug !== gymSlug) {
        continue;
      }

      console.log(`🔄 Processing gym: ${gym.name}`);

      const results = {
        birthdays: { found: 0, sent: 0 },
        inactive30: { found: 0, sent: 0 },
        inactive60: { found: 0, sent: 0 },
        errors: [] as string[],
      };

      const debug: Record<string, unknown> = {};

      try {
        // Haal leden op
        const allMembers = await getAllActiveMembersForGym(
          gym.gymly_api_key,
          gym.gymly_business_id
        );

        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDay = today.getDate();

        // Debug info
        debug.totalMembers = allMembers.length;
        debug.membersWithPhone = allMembers.filter(u => u.phoneNumber).length;
        debug.membersWithLastCheckin = allMembers.filter(u => u.lastCheckinAt).length;
        debug.membersWithBirthday = allMembers.filter(u => u.dateOfBirth).length;

        const usableMembers = allMembers.filter(u => u.phoneNumber && u.lastCheckinAt);
        debug.usableMembers = usableMembers.length;

        // Inactivity breakdown
        debug.inactivityBreakdown = {
          '0-7 dagen': usableMembers.filter(u => {
            const days = Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24));
            return days <= 7;
          }).length,
          '8-14 dagen': usableMembers.filter(u => {
            const days = Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24));
            return days > 7 && days <= 14;
          }).length,
          '15-30 dagen': usableMembers.filter(u => {
            const days = Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24));
            return days > 14 && days <= 30;
          }).length,
          '31-60 dagen': usableMembers.filter(u => {
            const days = Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24));
            return days > 30 && days <= 60;
          }).length,
          '60+ dagen': usableMembers.filter(u => {
            const days = Math.floor((Date.now() - new Date(u.lastCheckinAt!).getTime()) / (1000 * 60 * 60 * 24));
            return days > 60;
          }).length,
        };

        // Haal templates op
        const template30 = await getMessageTemplate(gym.id, 'inactief_30');
        const template60 = await getMessageTemplate(gym.id, 'inactief_60');
        const templateBirthday = await getMessageTemplate(gym.id, 'verjaardag');

        // === VERJAARDAGEN ===
        if (templateBirthday) {
          const birthdayMembers = allMembers.filter(user => {
            if (!user.dateOfBirth || !user.phoneNumber) return false;
            const dob = new Date(user.dateOfBirth);
            return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
          });

          results.birthdays.found = birthdayMembers.length;

          for (const user of birthdayMembers) {
            try {
              await sendTemplateMessage({
                to: user.phoneNumber!,
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
                variables: {
                  '1': templateBirthday.date_text,
                  '2': templateBirthday.message_text,
                },
              });
              await logMessage(gym.id, 'verjaardag', user.phoneNumber!, user.firstName);
              results.birthdays.sent++;
            } catch (error) {
              results.errors.push(`Birthday ${user.firstName}: ${error}`);
            }
          }
        }

        // === INACTIEVE LEDEN ===
        const inactive60 = getInactiveMembers(allMembers, 60);
        const inactive30 = getInactiveMembers(allMembers, 30).filter(
          user => !inactive60.find(u => u.id === user.id)
        );

        results.inactive30.found = inactive30.length;
        results.inactive60.found = inactive60.length;

        // 60 dagen
        if (template60) {
          for (const user of inactive60) {
            const cacheKey = `${gym.id}-inactive-${user.id}`;
            const lastSent = sentMessages.get(cacheKey);
            if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) continue;

            try {
              await sendTemplateMessage({
                to: user.phoneNumber!,
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
                variables: {
                  '1': template60.date_text,
                  '2': template60.message_text,
                },
              });
              sentMessages.set(cacheKey, Date.now());
              await logMessage(gym.id, 'inactief_60', user.phoneNumber!, user.firstName);
              results.inactive60.sent++;
            } catch (error) {
              results.errors.push(`Inactive60 ${user.firstName}: ${error}`);
            }
          }
        }

        // 30 dagen
        if (template30) {
          for (const user of inactive30) {
            const cacheKey = `${gym.id}-inactive-${user.id}`;
            const lastSent = sentMessages.get(cacheKey);
            if (lastSent && Date.now() - lastSent < 7 * 24 * 60 * 60 * 1000) continue;

            try {
              await sendTemplateMessage({
                to: user.phoneNumber!,
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
                variables: {
                  '1': template30.date_text,
                  '2': template30.message_text,
                },
              });
              sentMessages.set(cacheKey, Date.now());
              await logMessage(gym.id, 'inactief_30', user.phoneNumber!, user.firstName);
              results.inactive30.sent++;
            } catch (error) {
              results.errors.push(`Inactive30 ${user.firstName}: ${error}`);
            }
          }
        }

        allResults[gym.name] = { debug, results };

      } catch (error) {
        allResults[gym.name] = { error: String(error) };
      }
    }

    console.log('✅ Daily automation complete for all gyms');

    return NextResponse.json({
      success: true,
      gymsProcessed: Object.keys(allResults).length,
      results: allResults,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Daily cron error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}