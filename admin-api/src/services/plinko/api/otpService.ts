import { format } from 'path';
import UserOtp from '../../../models/plinko/UserOtpModel';
import twilio from 'twilio';

const client = twilio(process.env.PLINKO_TWILIO_ACCOUNT_SID, process.env.PLINKO_TWILIO_AUTH_TOKEN);

export const sendOtp = async (phoneNumber: string) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    // Store OTP in the database
    await UserOtp.upsert({
      phoneNumber,
      otp,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    console.log("Otp service is called with otp:",otp);
    // Format the phone number with country code if not present
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`; // Adding India's country code

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.PLINKO_TWILIO_PHONE_NUMBER, // Replace with your Twilio number
      to: formattedNumber,
    });

    return true;
  } catch (error) {
    console.error(error);
    return { error: 'SEND_OTP_FAILED' };
  }
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
  try {
    const userOtp = await UserOtp.findOne({ where: { phoneNumber, otp } });
    if (!userOtp) {
      return { error: 'INVALID_OTP' };
    }

    if (new Date() > userOtp.expiresAt) {
      return { error: 'OTP_EXPIRED' };
    }

    // OTP is valid, delete it from the database
    await userOtp.destroy();
    
    return true;
  } catch (error) {
    console.error(error);
    return { error: 'VERIFY_OTP_FAILED' };
  }
};
