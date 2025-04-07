import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';
import { authenticateStore, requestOtp } from '../../../services/Spin/storeAuthService';

export const sendOtpController = async (req: Request, res: Response) => {
  const { mobile } = req.body;
  if (!mobile) {
    return sendErrorResponse(res, 'Mobile number is required.');
  }
  return await requestOtp(mobile, res);
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;
  try {
    if (!mobile) {
      return sendErrorResponse(res, 'INVALID_INPUT', req);
    }
    if (!otp) {
      return sendErrorResponse(res, 'INVALID_OTP', req);
    }

    const { token, store } = await authenticateStore(mobile, otp);
    return sendSuccessResponse(res, 'LOGIN', { token, store });
  } catch (error: any) {
    if (error.message === 'Invalid or expired OTP') {
      return sendErrorResponse(res, 'INVALID_OTP', req);
    }
    if (error.message === 'Login not allowed. This store is not marked as default.') {
      return sendErrorResponse(res, 'NOT_DEFAULT_STORE', req);
    }
    return sendErrorResponse(res, 'GENERIC', req, error);
  }
};
