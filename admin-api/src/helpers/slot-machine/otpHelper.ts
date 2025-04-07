// src/services/api/otpService.ts

import twilio from 'twilio';
import dotenv from 'dotenv';
import { RESPONSES } from '../../constants';

dotenv.config();

// Twilio configuration
const accountSid = process.env.Slot_Machine_TWILIO_ACCOUNT_SID;
const authToken = process.env.Slot_Machine_TWILIO_AUTH_TOKEN;
const verifySid = process.env.Slot_Machine_TWILIO_VERIFY_SID;

// Create twilio client
const client = twilio(accountSid, authToken);

interface OtpResponse {
  status: boolean;
  message: string;
}

const formatPhoneNumber = (phone: string) => {
  if (!phone.startsWith('+')) {
    return `+91${phone}`; // Assuming it's an Indian number, change `+91` accordingly.
  }
  return phone;
};


/**
 * Send OTP to a phone number
 * @param phoneNumber - The phone number to send OTP to
 */
export const sendOtp = async (phoneNumber: string): Promise<OtpResponse> => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const verification = await client.verify.v2
      .services(verifySid!)
      .verifications.create({ to: formattedNumber, channel: 'sms' });

    return {
      status: verification.status === 'pending',
      message: RESPONSES.SUCCESS.OTP_SENT,
    };
  } catch (error) {
    return {
      status: false,
      message: RESPONSES.ERROR.OTP_SEND_FAILED,
    };
  }
};

/**
 * Verify OTP for a phone number
 * @param phoneNumber - The phone number to verify
 * @param otp - The OTP code to verify
 */
export const verifyOtp = async (phoneNumber: string, otp: string): Promise<OtpResponse> => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const verification = await client.verify.v2
      .services(verifySid!)
      .verificationChecks.create({ to: formattedNumber, code: otp });

    return {
      status: verification.status === 'approved',
      message: verification.status === 'approved' ? RESPONSES.SUCCESS.OTP_VERIFIED : RESPONSES.ERROR.INVALID_OTP,
    };
  } catch (error) {
    return {
      status: false,
      message: RESPONSES.ERROR.OTP_VERIFICATION_FAILED,
    };
  }
};