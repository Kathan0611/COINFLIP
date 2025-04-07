// src/services/api/spinService.ts

import { Op } from 'sequelize';
import SlotConfig from '../../../models/slot-machine/SlotConfig';
import SpinHistory from '../../../models/slot-machine/SpinHistory';
import RewardHistory from '../../../models/slot-machine/RewardHistory';
import {
  SlotConfigAttributes,
  SpecificCombination,
  SpinResponseData,
  // AuthenticatedSpinRequest,
  // OtpVerificationRequest,
} from 'slot-config';
import { STATUS_CODES } from '../../../constants/statusCodes';
import { checkDailyLimit } from './dailyLimitService';
import { sendOtp, verifyOtp } from '../../../helpers/slot-machine/otpHelper';
import { RESPONSES } from '../../../constants';

interface SpinServiceResponse {
  status: boolean | number | string | undefined;
  message: string;
  data: any;
}

async function getSlotConfig(): Promise<SlotConfigAttributes | null> {
  return await SlotConfig.findOne({ where: { status: true } });
}

function generateRandomCombination(combinations: SpecificCombination[]): SpecificCombination {
  const randomIndex = Math.floor(Math.random() * combinations.length);
  return combinations[randomIndex];
}

async function countTotalRewards(): Promise<number> {
  return await RewardHistory.count();
}

async function hardDeleteRewards(): Promise<void> {
  await RewardHistory.destroy({ truncate: true, restartIdentity: true });
}

async function countPrizeRewards(prizeName: string): Promise<number> {
  return await RewardHistory.count({ where: { prize: prizeName } });
}

async function createSpinHistory(
  user: { name: string; number: string },
  combination: SpecificCombination | null,
  prize: { name: string; prize_limit: number } | null,
) {
  return await SpinHistory.create({
    user_name: user.name,
    user_number: user.number,
    result: prize ? 'win' : 'loss',
    prize_name: prize ? prize.name : null,
  });
}

async function createRewardHistory(data: { prize: string; cust_id: number }) {
  return await RewardHistory.create({ prize: data.prize, cust_id: data.cust_id });
}

export async function generateSpinResult(user: { name: string; number: string }): Promise<SpinServiceResponse> {
  const config = await getSlotConfig();
  if (!config) {
    return {
      status: false,
      message: RESPONSES.ERROR.SLOT_CONFIG_NOT_FOUND,
      data: null,
    };
  }

  // Filter out combinations whose first prize has a prize_limit of 0.
  const availableCombinations = (config.specific_combinations || []).filter(combo => {
    if (!combo.prizes || combo.prizes.length === 0) return false;
    return combo.prizes[0].prize_limit > 0;
  });

  if (availableCombinations.length === 0) {
    await createSpinHistory(user, null, null);
    return {
      status: true,
      message: RESPONSES.SUCCESS.SPIN_RESULT_CREATED,
      data: { eligible: true, result: 'loss', combination: null },
    };
  }

  let prizeAwarded: { name: string; prize_limit: number } | null = null;
  let selectedCombination: SpecificCombination | null = null;
  let attemptCount = 0;
  const maxAttempts = config.total_prize_limit;

  while (!prizeAwarded && attemptCount < maxAttempts) {
    attemptCount++;
    selectedCombination = generateRandomCombination(availableCombinations);
    const prize = selectedCombination.prizes[0];

    const totalRewards = await countTotalRewards();
    if (totalRewards >= config.total_prize_limit) {
      await hardDeleteRewards();
    }

    const prizeCount = await countPrizeRewards(prize.name);
    if (prizeCount < prize.prize_limit) {
      prizeAwarded = prize;
      break;
    }
  }

  if (!prizeAwarded) {
    await createSpinHistory(user, null, null);
    return {
      status: true,
      message: RESPONSES.SUCCESS.SPIN_RESULT_CREATED,
      data: { eligible: true, result: 'loss', combination: null },
    };
  }

  const spinHistory = await createSpinHistory(user, selectedCombination, prizeAwarded);
  await createRewardHistory({ prize: prizeAwarded.name, cust_id: spinHistory.id! });

  return {
    status: true,
    message: RESPONSES.SUCCESS.SPIN_RESULT_CREATED,
    data: {
      eligible: true,
      result: 'win',
      combination: selectedCombination!.combination,
      prize: {
        prize_name: prizeAwarded.name,
      },
    },
  };
}

// New service function to handle authenticated spin
export async function handleAuthenticatedSpin(data: { name: string; number: string }): Promise<SpinServiceResponse> {
  // Check daily limit
  const limitCheck = await checkDailyLimit(data.number);

  if (!limitCheck.eligible) {
    return {
      status: STATUS_CODES.OK,
      message: RESPONSES.ERROR.DAILY_LIMIT_REACHED,
      data: {
        eligible: false,
      },
    };
  }

  // If eligible, generate spin result
  return await generateSpinResult(data);
}

// New service function to handle unauthenticated spin (OTP flow)
export async function handleUnauthenticatedSpin(data: { name: string; number: string }): Promise<SpinServiceResponse> {
  // Check daily limit
  const limitCheck = await checkDailyLimit(data.number);

  if (!limitCheck.eligible) {
    return {
      status: STATUS_CODES.OK,
      message: RESPONSES.ERROR.DAILY_LIMIT_REACHED,
      data: {
        eligible: false,
      },
    };
  }

  // Send OTP
  const otpResponse = await sendOtp(data.number);

  if (!otpResponse.status) {
    return {
      status: false,
      message: RESPONSES.ERROR.OTP_SEND_FAILED,
      data: { eligible: true, otpSent: false },
    };
  }

  return {
    status: true,
    message: RESPONSES.SUCCESS.OTP_SENT,
    data: {
      eligible: true,
      otpSent: true,
    },
  };
}

// New service function to handle OTP verification and spin
export async function handleOtpVerification(data: {
  name: string;
  number: string;
  otp: string;
}): Promise<SpinServiceResponse> {
  // Verify OTP
  const otpVerification = await verifyOtp(data.number, data.otp);

  if (!otpVerification.status) {
    return {
      status: false,
      message: RESPONSES.ERROR.INVALID_OTP,
      data: { verified: false },
    };
  }

  // Check daily limit again
  const limitCheck = await checkDailyLimit(data.number);

  if (!limitCheck.eligible) {
    return {
      status: STATUS_CODES.OK,
      message: RESPONSES.ERROR.DAILY_LIMIT_REACHED,
      data: {
        verified: true,
        eligible: false,
      },
    };
  }

  // If eligible, generate spin result
  const spinResult = await generateSpinResult(data);

  // Add verification status to response data
  spinResult.data = { verified: true, ...spinResult.data };

  return spinResult;
}

// Keep the original SpinService function for backward compatibility
export async function SpinService(user: { name: string; number: string }): Promise<SpinServiceResponse> {
  return await handleAuthenticatedSpin(user);
}
