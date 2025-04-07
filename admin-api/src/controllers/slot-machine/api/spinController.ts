// src/controllers/api/spinController.ts

import { Request, Response } from 'express';
import { handleAuthenticatedSpin, handleUnauthenticatedSpin, handleOtpVerification } from '../../../services/slot-machine/api/spinService';
import { STATUS_CODES } from '../../../constants/statusCodes';
import { AuthenticatedSpinRequest, OtpVerificationRequest } from 'slot-config';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { ResponseMessageKey } from '../../../constants';

export const spinController = async (req: Request, res: Response) => {
  try {
    const { user_name, user_number, isAuthenticated } = req.body as AuthenticatedSpinRequest;
    
    // Call appropriate service based on isAuthenticated flag
    const serviceResponse = isAuthenticated 
      ? await handleAuthenticatedSpin({ name: user_name, number: user_number })
      : await handleUnauthenticatedSpin({ name: user_name, number: user_number });
    
    // Handle response
    if (serviceResponse.status === false) {
      return sendErrorResponse(
        res,
        serviceResponse.message as ResponseMessageKey,
        req,
        undefined,
        serviceResponse.data,
        STATUS_CODES.BAD_REQUEST,
      );
    } else {
      const statusCode = typeof serviceResponse.status === 'number' 
        ? serviceResponse.status 
        : STATUS_CODES.OK;
      
      return sendSuccessResponse(
        res, 
        serviceResponse.message as ResponseMessageKey, 
        serviceResponse.data, 
        statusCode
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC' as ResponseMessageKey,
      req,
      error instanceof Error ? error : new Error(String(error)),
      { eligible: false, remainingSpins: 0 },
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { user_name, user_number, otp } = req.body as OtpVerificationRequest;
    
    // Call service to verify OTP and generate spin result
    const serviceResponse = await handleOtpVerification({ 
      name: user_name, 
      number: user_number, 
      otp 
    });
    
    // Handle response
    if (serviceResponse.status === false) {
      return sendErrorResponse(
        res,
        serviceResponse.message as ResponseMessageKey,
        req,
        undefined,
        serviceResponse.data,
        STATUS_CODES.BAD_REQUEST,
      );
    } else {
      const statusCode = typeof serviceResponse.status === 'number' 
        ? serviceResponse.status 
        : STATUS_CODES.OK;
      
      return sendSuccessResponse(
        res, 
        serviceResponse.message as ResponseMessageKey, 
        serviceResponse.data, 
        statusCode
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC' as ResponseMessageKey,
      req,
      error instanceof Error ? error : new Error(String(error)),
      { verified: false },
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};