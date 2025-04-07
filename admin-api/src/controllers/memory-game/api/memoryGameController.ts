import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../../constants';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import {
  checkEligibility,
  fetchGameConfig,
  handleGetReward,
  verifyUserOtp,
} from '../../../services/memory-game/api/memoryGameService';

// Get memory game configuration from database
export const getMemoryGameConfig = async (req: Request, res: Response) => {
  try {
    const config = await fetchGameConfig();
    if (typeof config === 'object' && 'error' in config) {
      return sendErrorResponse(res, config.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'GAME_CONFIG_FETCHED_SUCCESS', config);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

// Get a reward for a user
export const getReward = async (req: Request, res: Response) => {
  try {
    const { time_taken, moves_taken, pairs_matched, name, mobile } = req.body;

    const result = await handleGetReward(name, mobile, time_taken, moves_taken, pairs_matched);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'REWARD_FETCHED_SUCCESS', { reward: result });
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

// Check user eligibility for memory game
export const checkUserEligibility = async (req: Request, res: Response) => {
  try {
    const { mobile, isAuthenticated } = req.body;
    const result = await checkEligibility(mobile, isAuthenticated);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, result.message, { isEligible: result.success });
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

// Verify user OTP
export const otpVerification = async (req: Request, res: Response) => {
  try {
    const { otp, mobile } = req.body;
    const result = await verifyUserOtp(mobile, otp);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    if (result.success) {
      return sendSuccessResponse(res, 'OTP_VERIFICATION_SUCCESS', { isAuthenticated: true });
    }
    return sendSuccessResponse(res, result.message, { isAuthenticated: false });
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
