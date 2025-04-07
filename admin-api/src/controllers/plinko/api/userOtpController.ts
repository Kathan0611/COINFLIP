import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
// import { sendOtp, verifyOtp } from '../../../services/plinko/api/otpService';
import { rewardAfterVerify,authService } from '../../../services/plinko/api/authServiec';

export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const {name, phoneNumber , isAuth } = req.body;
    if (!phoneNumber) {
      return sendErrorResponse(res, 'INVALID_INPUT', req);
    }
    const otp = await authService({name,phoneNumber, isAuth});
    if (typeof otp === 'object' && 'error' in otp) {
      return sendErrorResponse(res, 'OTP_NOT_SENT', req, new Error(otp.error));
    }
    return sendSuccessResponse(res, 'OTP_SENT', otp);
  } catch (error) {
    return sendErrorResponse(res, 'OTP_SENT', req, new Error(String(error)));
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return sendErrorResponse(res, 'INVALID_INPUT', req);
    }
    const result = await rewardAfterVerify(name, phoneNumber, otp);
    // console.log("result:", result);
    
    // Check if the result object has an error property
    if (typeof result === 'object' && "error" in result) {
      return sendSuccessResponse(res, 'OTP_NOT_VERIFIED', result);
    }
    
    return sendSuccessResponse(res, 'OTP_VERIFIED', result);
  } catch (error) {
    return sendErrorResponse(res, 'OTP_NOT_VERIFIED', req, new Error(String(error)));
  }
};
