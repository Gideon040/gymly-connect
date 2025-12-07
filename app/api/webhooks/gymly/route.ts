import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '../../../../lib/whatsapp/client';

// Cancellation reason responses - gepersonaliseerd per reden
const CANCELLATION_RESPONSES: Record<string, { date: string; message: string }> = {
  // Kosten gerelateerd
  HIGH_COST: {
    date: 'even contact op',
    message: 'We hebben ook flexibele abonnementen. Mogen we je bellen over de mogelijkheden?',
  },
  FOUND_CHEAPER_ALTERNATIVE: {
    date: 'even contact op',
    message: 'We matchen graag andere aanbiedingen. Laat ons weten wat je hebt gevonden!',
  },
  FINANCIAL_HARDSHIP: {
    date: 'even contact op',
    message: 'We begrijpen het. We hebben opties om je te helpen - mogen we je bellen?',
  },

  // Motivatie/resultaat gerelateerd
  LACK_OF_PROGRESS: {
    date: 'een gratis PT sessie',
    message: 'We willen je helpen je doelen te bereiken. Gratis personal training sessie?',
  },
  SLOW_RESULTS: {
    date: 'een gratis PT sessie',
    message: 'Laat ons je helpen met een persoonlijk plan. Gratis PT sessie aangeboden!',
  },
  LOST_INTEREST: {
    date: 'deze week',
    message: 'Heb je onze nieuwe groepslessen al gezien? Kom vrijblijvend langs!',
  },
  FEELING_OVERWHELMED: {
    date: 'rustig aan',
    message: 'Begin klein - we helpen je graag met een relaxed schema. Geen druk!',
  },

  // Tijd/locatie gerelateerd
  TIME_CONSTRAINTS: {
    date: 'flexibele tijden',
    message: 'We zijn doordeweeks 6-23u open. Vroege of late workout past misschien beter?',
  },
  INCONVENIENT_HOURS: {
    date: 'onze nieuwe tijden',
    message: 'We hebben onze openingstijden uitgebreid! Check onze nieuwe uren.',
  },
  LOCATION_CHANGE: {
    date: 'veel succes',
    message: 'Jammer dat je verhuist! Je bent altijd welkom als je in de buurt bent.',
  },
  COMMUTING_DIFFICULTY: {
    date: 'even kijken',
    message: 'Vervoer lastig? We hebben gratis parkeren en zijn goed bereikbaar met OV.',
  },

  // Sociale redenen
  LACK_OF_COMMUNITY: {
    date: 'onze community events',
    message: 'We organiseren nu meer groepsactiviteiten! Kom kennismaken met andere leden.',
  },
  FRIENDS_LEFT: {
    date: 'een bring-a-friend actie',
    message: 'Breng een nieuwe vriend gratis mee! Samen sporten is leuker.',
  },
  UNWELCOMING_ENVIRONMENT: {
    date: 'persoonlijk contact',
    message: 'Dit vinden we vervelend om te horen. Mogen we je bellen om dit te bespreken?',
  },

  // Service gerelateerd
  POOR_COMMUNICATION: {
    date: 'verbetering',
    message: 'Bedankt voor je feedback. We willen dit graag rechtzetten - mogen we bellen?',
  },
  LACK_OF_ATTENTION: {
    date: 'een gratis PT sessie',
    message: 'Je verdient meer aandacht! Gratis personal training om je op weg te helpen?',
  },
  GENERAL_DISSATISFACTION: {
    date: 'graag contact',
    message: 'We horen graag wat er beter kan. Mogen we je bellen voor feedback?',
  },
  EQUIPMENT_ISSUES: {
    date: 'goed nieuws',
    message: 'We hebben geïnvesteerd in nieuwe apparatuur! Kom gerust kijken.',
  },
  CLEANLINESS_CONCERNS: {
    date: 'verbeteringen',
    message: 'We hebben extra schoonmaakrondes ingevoerd. Kom zelf kijken!',
  },

  // Persoonlijke omstandigheden
  HEALTH_ISSUES: {
    date: 'beterschap',
    message: 'We hopen dat het snel beter gaat. Je bent altijd welkom terug wanneer je klaar bent.',
  },
  MAJOR_LIFE_CHANGE: {
    date: 'succes',
    message: 'Veel succes met de veranderingen! Onze deur staat altijd open.',
  },
  TRAVEL_FREQUENCY: {
    date: 'flexibele opties',
    message: 'We hebben ook strippenkaarten voor wie veel reist. Interesse?',
  },

  // Overig
  SELF_SUFFICIENT: {
    date: 'goed gedaan',
    message: 'Knap dat je zelfstandig verder gaat! Mocht je ons missen, je bent welkom.',
  },
  SEASONAL_MEMBER: {
    date: 'tot snel',
    message: 'We zien je graag terug volgend seizoen! Tot dan.',
  },
  BETTER_ALTERNATIVE: {
    date: 'even contact',
    message: 'We zijn benieuwd wat je hebt gevonden. Feedback helpt ons verbeteren!',
  },
  OTHER: {
    date: 'binnenkort',
    message: 'We vinden het jammer dat je weggaat. Mogen we vragen waarom?',
  },
};

// Default configs
const DEFAULT_CONFIG = {
  // Proefles
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  // Opzegging fallback
  cancelDate: 'binnenkort',
  cancelMessage: 'We vinden het jammer dat je weggaat. Kunnen we iets doen om je te helpen blijven?',
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('📥 Gymly webhook:', JSON.stringify(payload, null, 2));

    const { eventType, data } = payload;

    // === PROEFLES ===
    if (eventType === 'BusinessLeadCreated') {
      const { lead } = data;
      const phoneNumber = lead?.phoneNumber;
      const firstName = lead?.firstName || 'daar';

      if (!phoneNumber) {
        console.log('⚠️ No phone number for lead:', lead?.id);
        return NextResponse.json({ success: true, skipped: 'no phone number' });
      }

      console.log(`📱 Sending proefles WhatsApp to ${firstName} (${phoneNumber})`);

      const result = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        variables: {
          '1': DEFAULT_CONFIG.welcomeDate,
          '2': DEFAULT_CONFIG.welcomeMessage,
        },
      });

      console.log('✅ Proefles WhatsApp sent:', result);

      return NextResponse.json({ 
        success: true, 
        type: 'proefles_bevestiging',
        eventType,
        recipient: firstName,
        messageSid: result.sid 
      });
    }

    // === OPZEGGING ===
    if (eventType === 'BusinessMembershipCancelled') {
      const { user, cancellationReason, membership } = data;
      const phoneNumber = user?.phoneNumber;
      const firstName = user?.firstName || 'daar';
      const membershipName = membership?.name || 'je abonnement';

      if (!phoneNumber) {
        console.log('⚠️ No phone number for cancelled member:', user?.id);
        return NextResponse.json({ success: true, skipped: 'no phone number' });
      }

      // Kies response op basis van cancellation reason
      const response = cancellationReason && CANCELLATION_RESPONSES[cancellationReason]
        ? CANCELLATION_RESPONSES[cancellationReason]
        : { date: DEFAULT_CONFIG.cancelDate, message: DEFAULT_CONFIG.cancelMessage };

      console.log(`📱 Sending cancellation WhatsApp to ${firstName} (${phoneNumber})`);
      console.log(`   Reden: ${cancellationReason || 'niet opgegeven'}`);
      console.log(`   Response: ${response.message}`);

      const result = await sendTemplateMessage({
        to: phoneNumber,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        variables: {
          '1': response.date,
          '2': response.message,
        },
      });

      console.log('✅ Cancellation WhatsApp sent:', result);

      return NextResponse.json({ 
        success: true, 
        type: 'opzegging_heractivatie',
        eventType,
        recipient: firstName,
        cancellationReason: cancellationReason || 'niet opgegeven',
        responseUsed: response,
        membershipName,
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
  return NextResponse.json({ 
    status: 'Gymly webhook active',
    supportedEvents: ['BusinessLeadCreated', 'BusinessMembershipCancelled'],
    cancellationReasonsSupported: Object.keys(CANCELLATION_RESPONSES),
  });
}