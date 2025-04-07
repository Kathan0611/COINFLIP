//src/controllers/admin/authController.ts
import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../constants/responses';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';
import {
  resetPassword as resetPasswordService,
  sendForgotPasswordEmail,
  signinUser,
} from '../../services/admin/authService';

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await signinUser(email, password);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'LOGIN', result);
  } catch (error: unknown) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await sendForgotPasswordEmail(email);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'FORGOT_PASSWORD_EMAIL_SENT');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const result = await resetPasswordService(token, newPassword);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'PASSWORD_RESET');
  } catch (error) {
    return sendErrorResponse(res, 'TOKEN_EXPIRED', req);
  }
};
