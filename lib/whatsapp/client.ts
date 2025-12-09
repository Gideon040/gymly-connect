import twilio from 'twilio';

interface Gym {
  id: string;
  name: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  whatsapp_number?: string;
}

interface SendMessageOptions {
  to: string;
  contentSid: string;
  variables: Record<string, string>;
  gym?: Gym;
}

export async function sendTemplateMessage({ to, contentSid, variables, gym }: SendMessageOptions) {
  // Gebruik gym-specifieke credentials, of fallback naar env vars
  const accountSid = gym?.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = gym?.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = gym?.whatsapp_number || process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken) {
    throw new Error('Missing Twilio credentials');
  }

  if (!fromNumber) {
    throw new Error('Missing WhatsApp number');
  }

  const client = twilio(accountSid, authToken);

  // Format phone number
  let formattedTo = to.replace(/\s/g, '');
  if (!formattedTo.startsWith('+')) {
    formattedTo = '+31' + formattedTo.replace(/^0/, '');
  }

  console.log(`📤 Sending WhatsApp to ${formattedTo} from ${fromNumber}`);
  console.log(`   Using Twilio account: ${accountSid.slice(0, 10)}...`);

  const message = await client.messages.create({
    to: `whatsapp:${formattedTo}`,
    from: `whatsapp:${fromNumber}`,
    contentSid,
    contentVariables: JSON.stringify(variables),
  });

  console.log(`✅ Message sent: ${message.sid}`);
  return message;
}

// Simpele versie voor directe berichten (geen template)
export async function sendDirectMessage(to: string, body: string, gym?: Gym) {
  const accountSid = gym?.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = gym?.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = gym?.whatsapp_number || process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Missing Twilio credentials');
  }

  const client = twilio(accountSid, authToken);

  let formattedTo = to.replace(/\s/g, '');
  if (!formattedTo.startsWith('+')) {
    formattedTo = '+31' + formattedTo.replace(/^0/, '');
  }

  const message = await client.messages.create({
    to: `whatsapp:${formattedTo}`,
    from: `whatsapp:${fromNumber}`,
    body,
  });

  return message;
}