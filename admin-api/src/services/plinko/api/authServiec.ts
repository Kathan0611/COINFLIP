import { eligibleUserService } from './eligibleUserService';
import { sendOtp, verifyOtp } from './otpService';
import { rewardUserService } from './rewardUserServiceNew';

interface UserInput {
  name: string;
  phoneNumber: string;
  isAuth: boolean;
}

export const authService = async ({ name, phoneNumber, isAuth }: UserInput) => {
  const IsEligible = await eligibleUserService({ name, phoneNumber });
  if (!IsEligible || IsEligible !== 'IsEligible') {
    return { eligible: false }
  }

  if (isAuth) {
    const reward = await rewardUserService({ name, phoneNumber });
    return reward;
  }

  const otpSent = await sendOtp(phoneNumber);
  if(typeof otpSent === 'object' && 'error' in otpSent){
    return otpSent;

  }
  return  { otpSentStatus: true, eligible: true };
};



export const rewardAfterVerify = async (name: string, phoneNumber: string, otp: string) => {
  const verifyOtpFlag = await verifyOtp(phoneNumber, otp);
  if (verifyOtpFlag !== true) {
    return {otpVerified:false , verifyOtpFlag};
  }

  const reward = await rewardUserService({ name, phoneNumber });

  return reward  && reward.error ? { reward, otpVerified: true } : reward;
};
