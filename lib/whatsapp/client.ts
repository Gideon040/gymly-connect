import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!;

const client = twilio(accountSid, authToken);

interface SendTemplateMessageParams {
  to: string;
  contentSid: string;
  variables: Record<string, string>;
}

interface SendFreeformMessageParams {
  to: string;
  body: string;
}

// Verstuur template bericht (buiten 24u window)
export async function sendTemplateMessage({ 
  to, 
  contentSid, 
  variables 
}: SendTemplateMessageParams) {
  const message = await client.messages.create({
    from: whatsappNumber,
    to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    contentSid,
    contentVariables: JSON.stringify(variables),
  });
  
  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
  };
}

// Verstuur vrij bericht (binnen 24u window na reply)
export async function sendFreeformMessage({ 
  to, 
  body 
}: SendFreeformMessageParams) {
  const message = await client.messages.create({
    from: whatsappNumber,
    to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    body,
  });
  
  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
  };
}

// Check message status
export async function getMessageStatus(messageSid: string) {
  const message = await client.messages(messageSid).fetch();
  return {
    sid: message.sid,
    status: message.status,
    errorCode: message.errorCode,
    errorMessage: message.errorMessage,
  };
}

export { client as twilioClient };