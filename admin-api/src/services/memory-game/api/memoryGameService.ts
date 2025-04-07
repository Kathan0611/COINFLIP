import { Op } from 'sequelize';
import { sendOTP, verifyOTP } from '../../../helpers/memory-game/smsHelper';
import { InitialGameConfig } from 'memory-game';
import MemoryGame from '../../../models/memory-game/memoryGameModel';
import UserLogs from '../../../models/memory-game/UserLogsModel';

// Helper function to find memory game configuration
const getGameConfig = async () => {
  const config = await MemoryGame.findOne();
  return config;
};

// Service to fetch memory game configuration and return initial game configuration
export const fetchGameConfig = async () => {
  const result = await getGameConfig();
  if (!result) return { error: 'GAME_CONFIG_NOT_FOUND' };

  const config: InitialGameConfig = {
    game_time: result.game_time,
    total_cards: result.total_cards,
    game_theme: result.game_theme,
    background_image: result.background_image,
    card_cover_image: result.card_cover_image,
    card_front_images: result.card_front_images,
  };

  return config;
};

// Calculate score based on time taken, moves taken and pairs matched
const calculateScore = async (time_taken: number, moves_taken: number, pairs_matched: number) => {
  const config = await getGameConfig();
  if (!config) return { error: 'GAME_CONFIG_NOT_FOUND' };

  const total_time = config.game_time;
  const optimal_moves = config.total_cards;
  const total_pairs = config.total_cards / 2;

  // Check for invalid input
  const isInvalidGame = !(time_taken === total_time || (pairs_matched === total_pairs && moves_taken >= optimal_moves));
  const isInvalidStats = time_taken > total_time || pairs_matched > total_pairs || moves_taken < pairs_matched * 2;

  if (isInvalidGame || isInvalidStats) return { error: 'INVALID_GAME_STATE' };

  // Efficiency calculation
  const time_efficiency = (total_time - time_taken) / total_time;
  const move_efficiency = optimal_moves / moves_taken;
  const pairs_efficiency = pairs_matched / total_pairs;

  // Handle potential division by zero or move_efficiency being greater than 1
  const safe_move_efficiency =
    moves_taken === 0 || pairs_matched === 0 ? 0 : move_efficiency > 1 ? 1 / move_efficiency : move_efficiency;

  // Score calculation
  const score = ((time_efficiency + safe_move_efficiency + pairs_efficiency) / 3) * 100;

  return score;
};

// Return reward based on score
const fetchReward = async (score: number) => {
  // Handle invalid score
  if (score < 0 || score > 100) return { error: 'INVALID_SCORE' };

  const config = await getGameConfig();
  if (!config) return { error: 'GAME_CONFIG_NOT_FOUND' };

  const rewards = config.rewards;

  // Find the reward corresponding to the score
  if (score <= 25) {
    return rewards.better_luck_next_time;
  } else if (score > 25 && score <= 40) {
    return rewards.novice;
  } else if (score > 40 && score <= 55) {
    return rewards.beginner;
  } else if (score > 55 && score <= 70) {
    return rewards.skilled;
  } else if (score > 70 && score <= 85) {
    return rewards.expert;
  } else if (score > 85 && score <= 100) {
    return rewards.grandmaster;
  }

  return { error: 'GENERIC' };
};

// Function to add a new user log
const addUserLog = async (logData: UserLogs) => {
  const log = await UserLogs.create(logData);
  if (!log) return { error: 'USER_LOG_CREATION_FAILED' };
};

// Service to handle reward fetch and user log creation
export const handleGetReward = async (
  name: string,
  mobile: string,
  time_taken: number,
  moves_taken: number,
  pairs_matched: number,
) => {
  // Calculate score
  const score = await calculateScore(time_taken, moves_taken, pairs_matched);
  if (typeof score === 'object' && 'error' in score) {
    return { error: score.error };
  }

  // Reward fetching
  const reward = await fetchReward(score);
  if (typeof reward === 'object' && 'error' in reward) {
    return { error: reward.error };
  }

  // Add user log
  const logData: Partial<UserLogs> = { name: name, mobile: mobile, score: score, reward: reward };
  const result = await addUserLog(logData as UserLogs);
  if (typeof result === 'object' && 'error' in result) {
    return { error: result.error };
  }

  return reward;
};

// Helper function to check user eligibility to play
const checkUserEligibility = async (mobile: string) => {
  const gameConfig = await getGameConfig();
  if (!gameConfig) return { success: false, error: 'GAME_CONFIG_NOT_FOUND' };

  // Determine if there's a daily limit
  const hasDailyLimit = gameConfig.daily_limit != null && gameConfig.daily_limit > 0;

  if (hasDailyLimit) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count the number of user logs for the given mobile in the last 24 hours.
    const logsInLast24Hours = await UserLogs.count({
      where: {
        mobile: mobile,
        createdAt: {
          [Op.between]: [twentyFourHoursAgo, now],
        },
      },
    });

    if (logsInLast24Hours >= gameConfig.daily_limit) {
      return { success: false, message: 'DAILY_LIMIT_EXCEEDED' };
    }
  }

  return { success: true, message: 'USER_ELIGIBLE_TO_PLAY' };
};

// Service which checks user eligibility and sending otp
export const checkEligibility = async (mobile: string, isAuthenticated?: boolean) => {
  const eligibility = await checkUserEligibility(mobile);
  if (!eligibility.success) {
    return eligibility;
  }

  if (!isAuthenticated) {
    const response = await sendOTP(mobile); // Uncomment this line when frontend integration and testing is over.
    // const response = { success: true }; // Remove this line when frontend integration and testing is over.
    if (response.success) {
      return { success: true, message: 'OTP_SENT_SUCCESSFULLY' };
    }
    return { success: false, error: 'FAILED_TO_SEND_OTP' };
  }

  return { success: true, message: 'USER_ELIGIBLE_TO_PLAY' };
};

// Remove this function when frontend integration and testing is over.
function verifyOTPTest(otp: string) {
  if (otp == '123456') {
    return { success: true };
  } else {
    return { success: false, error: 'INVALID_OTP' };
  }
}

// Service which checks user eligibility and verify otp
export const verifyUserOtp = async (mobile: string, otp: string) => {
  const eligibility = await checkUserEligibility(mobile);
  if (!eligibility.success) {
    return eligibility;
  }

  const response = await verifyOTP(mobile, otp); // Uncomment this line when frontend integration and testing is over.
  // const response = await verifyOTPTest(otp); // Remove this line when frontend integration and testing is over.

  if (typeof response === 'object' && 'error' in response) {
    return { error: response.error };
  }
  if (response.success) {
    return { success: true, message: 'OTP_VERIFICATION_SUCCESS' };
  }

  return { success: false, error: 'OTP_VERIFICATION_FAILED' };
};
