import { Request, Response } from 'express';
import { sendOtpToUser, gameConfig,verifyOtpAndPlay } from '../../../services/Coin-Flip/api/gameService';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';


// Controller for Coin Flip
export const flipCoinHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, mobile_number, prediction_value,isAuth } = req.body;

    if (!user_name || !mobile_number || !prediction_value) {
      return sendErrorResponse(res, 'MISSING_REQUIRED_FIELDS', req);
    }

    const result = await sendOtpToUser(user_name, prediction_value, mobile_number,isAuth);

    return sendSuccessResponse(res, 'COIN_FLIPPED', result);
  } catch (error) {
    console.error('Error in flipCoinHandler:', error);
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

// Controller for Game_data
export const gameconfigHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await gameConfig();

    return sendSuccessResponse(res, 'GAME_DATA_SETTED', result);
  } catch (error) {
    console.error('Error in gameconfigHandler:', error);
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


// Verify user OTP
export const otpVerification = async (req: Request, res: Response) => {

  try {
    const {user_name, otp, mobile_number,prediction_value } = req.body;
    const result = await verifyOtpAndPlay(user_name,mobile_number, otp,prediction_value);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, 'GENERIC', req);
    }
  
    if (result.success) {
      return sendSuccessResponse(res, 'OTP_VERIFICATION_SUCCESS', { ...result,isAuthenticated: true });
    }
    return sendSuccessResponse(res, result.message, { isAuthenticated: false });
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
