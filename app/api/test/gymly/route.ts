import { NextResponse } from 'next/server';
import { getAllActiveMembers, getInactiveMembers, getBirthdayMembers } from '../../../../lib/gymly/client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { gymId, action } = await request.json();

    // Haal gym op
    const { data: gym, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
      .single();

    if (error || !gym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    if (!gym.gymly_api_key || !gym.gymly_business_id) {
      return NextResponse.json({ 
        error: 'Gymly credentials niet ingesteld',
        missing: {
          api_key: !gym.gymly_api_key,
          business_id: !gym.gymly_business_id
        }
      }, { status: 400 });
    }

    // Test connectie
    if (action === 'test_connection') {
      try {
        const members = await getAllActiveMembers(gym, false);
        return NextResponse.json({
          success: true,
          gym: gym.name,
          memberCount: members.length,
          message: `Verbinding succesvol! ${members.length} actieve leden gevonden.`
        });
      } catch (apiError) {
        return NextResponse.json({
          success: false,
          error: String(apiError),
          message: 'Kon geen verbinding maken met Gymly API'
        });
      }
    }

    // Haal alle leden op
    if (action === 'fetch_members') {
      const members = await getAllActiveMembers(gym, true);
      return NextResponse.json({
        success: true,
        members: members.slice(0, 50), // Max 50 voor preview
        totalCount: members.length
      });
    }

    // Haal inactieve leden op
    if (action === 'fetch_inactive') {
      const members = await getAllActiveMembers(gym);
      const inactive30 = getInactiveMembers(members, 30);
      const inactive60 = getInactiveMembers(members, 60);
      
      return NextResponse.json({
        success: true,
        inactive30: inactive30.map(m => ({
          id: m.id,
          name: m.fullName || `${m.firstName} ${m.lastName}`,
          phone: m.phoneNumber,
          lastCheckin: m.lastCheckinAt,
          daysSinceCheckin: m.lastCheckinAt 
            ? Math.floor((Date.now() - new Date(m.lastCheckinAt).getTime()) / (1000 * 60 * 60 * 24))
            : null
        })),
        inactive60: inactive60.map(m => ({
          id: m.id,
          name: m.fullName || `${m.firstName} ${m.lastName}`,
          phone: m.phoneNumber,
          lastCheckin: m.lastCheckinAt,
          daysSinceCheckin: m.lastCheckinAt 
            ? Math.floor((Date.now() - new Date(m.lastCheckinAt).getTime()) / (1000 * 60 * 60 * 24))
            : null
        })),
        counts: {
          total: members.length,
          inactive30: inactive30.length,
          inactive60: inactive60.length
        }
      });
    }

    // Haal verjaardagen op
    if (action === 'fetch_birthdays') {
      const members = await getAllActiveMembers(gym);
      const birthdays = getBirthdayMembers(members);
      
      return NextResponse.json({
        success: true,
        birthdays: birthdays.map(m => ({
          id: m.id,
          name: m.fullName || `${m.firstName} ${m.lastName}`,
          phone: m.phoneNumber,
          dateOfBirth: m.dateOfBirth
        })),
        count: birthdays.length
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}