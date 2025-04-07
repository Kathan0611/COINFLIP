import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.COIN_FLIP_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.COIN_FLIP_TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SID = process.env.COIN_FLIP_TWILIO_VERIFY_SID;

// Validate that the Twilio credentials are set
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SID) {
  throw new Error('Twilio credentials are not set in environment variables');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Format the phone number to be used in the Twilio API
const formatPhoneNumber = (phone: string): string => {
  const trimmed = phone.trim();
  if (!trimmed.startsWith('+')) {
    return `+91${trimmed}`; // Adjust country code as needed
  }
  return trimmed;
};

// Sends an OTP to the user's mobile number.
export const sendOTP = async (phoneNumber: string, customMessage?: string) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    const response = await client.verify.v2.services(TWILIO_VERIFY_SID).verifications.create({
      to: formattedNumber,
      channel: 'sms',
    });

    return { success: true, sid: response.sid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Verifies the OTP entered by the user.
export const verifyOTP = async (phoneNumber: string, otp: string) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    const response = await client.verify.v2.services(TWILIO_VERIFY_SID).verificationChecks.create({
      to: formattedNumber,
      code: otp,
    });
    

    if (!response.valid || response.status !== 'approved') {
      return { success: false, error: 'INVALID_OTP' };
    }

    return { success: true, message: 'OTP_VERIFICATION_SUCCESS' };
  } catch (error: any) {
    return { success: false, message: 'OTP_VERIFICATION_FAILED', error: error.message };
  }
};